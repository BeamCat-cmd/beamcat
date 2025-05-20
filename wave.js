class WaveParticles {
    constructor() {
        this.setup();
        this.createParticles();
        this.animate();
        
        // 添加窗口大小改变监听
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    setup() {
        // 初始化场景
        this.scene = new THREE.Scene();

        // 设置透视相机
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / 800, 0.6, 1000);
        this.camera.position.set(0, -20, 50);
        this.camera.rotation.x = 0.05;

        // 设置渲染器
        this.canvas = document.getElementById('waveCanvas');
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, 800);
        this.renderer.setClearColor(0x000000, 0);

        // 动画参数
        this.time = 0;
        
        // 定义主要波浪方向和特性
        this.mainWaveDirection = Math.PI * 0.25; // 45度角的主要传播方向
        
        // 波浪组件配置
        this.waveComponents = [
            // 主波浪 - 最大振幅，固定方向
            {
                frequency: { x: 0.2, z: 0.2 },
                amplitude: 1.8,
                speed: 1.0,
                direction: this.mainWaveDirection,
                phase: 0
            },
            // 次要波浪 - 与主波浪垂直
            {
                frequency: { x: 0.15, z: 0.15 },
                amplitude: 1.2,
                speed: 0.8,
                direction: this.mainWaveDirection + Math.PI / 2,
                phase: Math.PI / 4
            },
            // 细节波浪1 - 小幅度快速波动
            {
                frequency: { x: 0.3, z: 0.3 },
                amplitude: 0.4,
                speed: 1.2,
                direction: this.mainWaveDirection + Math.PI / 6,
                phase: Math.PI / 3
            },
            // 细节波浪2 - 另一个方向的小波动
            {
                frequency: { x: 0.25, z: 0.25 },
                amplitude: 0.3,
                speed: 1.1,
                direction: this.mainWaveDirection - Math.PI / 6,
                phase: Math.PI / 2
            }
        ];

        // 为每个粒子设置随机特性，但范围更小以保持秩序
        this.randomOffsets = [];
    }

    createParticles() {
        // 计算基于屏幕宽度的网格大小
        const aspectRatio = window.innerWidth / 800;
        const gridSizeY = 30; // 垂直方向的网格数量
        const gridSizeX = Math.ceil(gridSizeY * aspectRatio); // 水平方向根据屏幕宽度计算
        const spacing = 1.8; // 点之间的间距
        const particleCount = gridSizeX * gridSizeY;
        
        // 创建几何体
        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array(particleCount * 3);
        this.colors = new Float32Array(particleCount * 3);
        this.opacities = new Float32Array(particleCount);
        
        // 重新初始化随机偏移数组，减小随机范围以保持更多秩序
        this.randomOffsets = Array(particleCount).fill(0).map(() => ({
            phase: Math.random() * Math.PI * 2,
            amplitude: Math.random() * 0.2 + 0.9,    // 0.9 到 1.1 的小范围随机振幅
            speed: Math.random() * 0.2 + 0.9,        // 0.9 到 1.1 的小范围随机速度
            turbulence: Math.random() * 0.15 + 0.05  // 0.05 到 0.2 的小范围湍流
        }));

        // 计算Z轴方向的最大距离用于渐隐效果
        const maxZDistance = (gridSizeY * spacing) / 2;

        // 生成粒子位置和颜色
        for (let i = 0; i < gridSizeX; i++) {
            for (let j = 0; j < gridSizeY; j++) {
                const index = (i * gridSizeY + j) * 3;
                const opacityIndex = i * gridSizeY + j;
                
                // 计算网格位置
                const x = (i - gridSizeX/2) * spacing;
                const z = (j - gridSizeY/2) * spacing;
                this.positions[index] = x;
                this.positions[index + 1] = 0;
                this.positions[index + 2] = z;

                // 只基于Z轴距离计算渐隐效果
                const zDistance = Math.abs(z);
                const opacity = Math.max(0, 1 - (zDistance / maxZDistance) * 1.5);
                this.opacities[opacityIndex] = opacity;

                // 随机选择红色粒子
                const isRed = Math.random() < 0.05; // 5%的概率是红色
                if (isRed) {
                    this.colors[index] = 1.0;     // R
                    this.colors[index + 1] = 0.2;  // G
                    this.colors[index + 2] = 0.2;  // B
                } else {
                    this.colors[index] = 1.0;     // R
                    this.colors[index + 1] = 1.0;  // G
                    this.colors[index + 2] = 1.0;  // B
                }
            }
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
        this.geometry.setAttribute('opacity', new THREE.BufferAttribute(this.opacities, 1));

        // 创建点材质
        const pointTexture = this.createPointTexture();
        
        // 创建自定义着色器材质
        const customMaterial = new THREE.ShaderMaterial({
            uniforms: {
                pointTexture: { value: pointTexture },
                size: { value: 1.2 }
            },
            vertexShader: `
                attribute float opacity;
                varying float vOpacity;
                varying vec3 vColor;
                void main() {
                    vOpacity = opacity;
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                    gl_PointSize = ${1.2.toFixed(1)} * (300.0 / -mvPosition.z);
                }
            `,
            fragmentShader: `
                uniform sampler2D pointTexture;
                varying float vOpacity;
                varying vec3 vColor;
                void main() {
                    gl_FragColor = vec4(vColor, vOpacity) * texture2D(pointTexture, gl_PointCoord);
                }
            `,
            transparent: true,
            vertexColors: true
        });

        // 创建点云系统
        this.points = new THREE.Points(this.geometry, customMaterial);
        this.scene.add(this.points);
    }

    createPointTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 128;
        const ctx = canvas.getContext('2d');

        // 创建径向渐变
        const gradient = ctx.createRadialGradient(
            64, 64, 0,
            64, 64, 64
        );
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.4, '#ffffff');
        gradient.addColorStop(1, 'transparent');

        // 绘制圆形
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);

        return new THREE.CanvasTexture(canvas);
    }

    // 计算复合波浪高度
    calculateWaveHeight(x, z, time, particleIndex) {
        const offset = this.randomOffsets[particleIndex];
        let height = 0;
        
        // 应用主要波浪组件
        this.waveComponents.forEach((wave, index) => {
            const dirX = Math.cos(wave.direction);
            const dirZ = Math.sin(wave.direction);
            const dirComponent = x * dirX + z * dirZ;
            
            // 计算波浪高度
            const waveHeight = Math.sin(
                dirComponent * wave.frequency.x + 
                time * wave.speed + 
                wave.phase
            ) * wave.amplitude;
            
            // 主波浪权重更大
            height += waveHeight * (index === 0 ? 1 : 0.5);
        });

        // 添加温和的局部变化
        const localVariation = offset.turbulence * Math.sin(
            time * offset.speed + offset.phase
        );

        // 应用个体粒子的随机特性，但保持变化温和
        return height * offset.amplitude + localVariation;
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        this.time += 0.005;

        // 更新粒子位置
        const positions = this.geometry.attributes.position.array;
        const count = positions.length / 3;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const x = positions[i3];
            const z = positions[i3 + 2];

            // 使用复合波浪函数计算高度
            positions[i3 + 1] = this.calculateWaveHeight(x, z, this.time, i);
        }

        this.geometry.attributes.position.needsUpdate = true;

        // 渲染场景
        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        // 更新相机
        this.camera.aspect = window.innerWidth / 800;
        this.camera.updateProjectionMatrix();

        // 更新渲染器
        this.renderer.setSize(window.innerWidth, 800);

        // 重新创建粒子以适应新的屏幕宽度
        this.scene.remove(this.points);
        this.createParticles();
    }
}

// 当页面加载完成时初始化
document.addEventListener('DOMContentLoaded', () => {
    new WaveParticles();
}); 