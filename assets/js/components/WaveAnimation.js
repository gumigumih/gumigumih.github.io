const { defineComponent } = Vue

export default defineComponent({
  name: 'WaveAnimation',
  mounted() {
    this.animateWaves();
  },
  methods: {
    generateWavePath(time, amplitude, frequency, phase) {
      const points = [];
      const width = 1440;
      const height = 320;
      const segments = 36;
      const segmentWidth = width / segments;

      for (let i = 0; i <= segments; i++) {
        const x = i * segmentWidth;
        const y = height - 100 + Math.sin((x * frequency + time + phase) * Math.PI / 180) * amplitude;
        points.push(`${x},${y}`);
      }

      // 波の下部を閉じる
      points.push(`${width},${height}`);
      points.push(`0,${height}`);

      return `M ${points.join(' L ')} Z`;
    },
    animateWaves() {
      const wave1 = document.getElementById('wave1');
      const wave2 = document.getElementById('wave2');
      const wave3 = document.getElementById('wave3');
      let waveTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - waveTime;
        const time = elapsed * 0.05;

        // 各波に異なるパラメータを設定
        wave1.setAttribute('d', this.generateWavePath(time, 30, 0.02, 0));
        wave2.setAttribute('d', this.generateWavePath(time, 25, 0.03, 60));
        wave3.setAttribute('d', this.generateWavePath(time, 20, 0.04, 120));

        requestAnimationFrame(animate);
      };

      animate();
    }
  },
  template: `
    <div class="wave-bg">
      <svg class="wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path id="wave1"></path>
      </svg>
      <svg class="wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path id="wave2"></path>
      </svg>
      <svg class="wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path id="wave3"></path>
      </svg>
    </div>
  `
}) 