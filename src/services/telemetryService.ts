export interface TelemetryMetrics {
  fps: number;
  drawLatencyMs: number;
  activeStrokesCount: number;
  totalPointsCount: number;
  memoryEstimateKB: number;
  droppedFramesCount: number;
  lastApiLatencyMs: number;
  deviceType: 'mouse' | 'touch' | 'stylus';
  hardwareConcurrency: number;
  devicePixelRatio: number;
}

class TelemetryServiceManager {
  private metrics: TelemetryMetrics = {
    fps: 60,
    drawLatencyMs: 4,
    activeStrokesCount: 0,
    totalPointsCount: 0,
    memoryEstimateKB: 16,
    droppedFramesCount: 0,
    lastApiLatencyMs: 120,
    deviceType: 'mouse',
    hardwareConcurrency: typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4,
    devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
  };

  private listeners: Set<(m: TelemetryMetrics) => void> = new Set();
  private frameTimes: number[] = [];
  private lastFrameTime: number = performance.now();

  public recordFrame(drawDurationMs: number, strokeCount: number = 0, pointCount: number = 0) {
    const now = performance.now();
    const delta = now - this.lastFrameTime;
    this.lastFrameTime = now;

    if (delta > 0) {
      this.frameTimes.push(1000 / delta);
      if (this.frameTimes.length > 30) {
        this.frameTimes.shift();
      }
    }

    if (drawDurationMs > 16.67) {
      this.metrics.droppedFramesCount++;
    }

    const avgFps = this.frameTimes.length > 0
      ? Math.round(this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length)
      : 60;

    this.metrics.fps = Math.min(144, Math.max(1, avgFps));
    this.metrics.drawLatencyMs = Math.round(drawDurationMs * 10) / 10;
    this.metrics.activeStrokesCount = strokeCount;
    this.metrics.totalPointsCount = pointCount;
    this.metrics.memoryEstimateKB = Math.round(Math.max(16, strokeCount * 0.45 + pointCount * 0.08));

    this.notify();
  }

  public recordApiLatency(latencyMs: number) {
    this.metrics.lastApiLatencyMs = Math.round(latencyMs);
    this.notify();
  }

  public setDeviceType(type: 'mouse' | 'touch' | 'stylus') {
    this.metrics.deviceType = type;
    this.notify();
  }

  public getMetrics(): TelemetryMetrics {
    return { ...this.metrics };
  }

  public subscribe(callback: (m: TelemetryMetrics) => void): () => void {
    this.listeners.add(callback);
    callback(this.getMetrics());
    return () => this.listeners.delete(callback);
  }

  private notify() {
    const data = this.getMetrics();
    this.listeners.forEach((l) => {
      try {
        l(data);
      } catch (err) {
        console.error('Telemetry listener error:', err);
      }
    });
  }
}

export const telemetryService = new TelemetryServiceManager();
