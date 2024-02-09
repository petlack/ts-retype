import { formatDuration, round } from './core.js';

export class Progress {
    constructor(
        private startedAt: Date,
        private processed: number,
        private total: number,
    ) {}

    static finite(total: number): Progress {
        return new Progress(new Date(), 0, total);
    }

    static infinite(): Progress {
        return Progress.finite(0);
    }

    setTotal(total: number) {
        this.total = total;
    }

    advanceBy(steps: number) {
        this.processed += steps;
    }

    advance() {
        this.advanceBy(1);
    }

    setProcessed(processed: number) {
        this.processed = processed;
    }

    reset() {
        this.startedAt = new Date();
        this.processed = 0;
    }

    formatDuration(): string {
        const ms = new Date().getTime() - this.startedAt.getTime();
        return formatDuration(ms);
    }

    formatSpeed(): string {
        const duration = new Date().getTime() - this.startedAt.getTime();
        const speedItemsPerMs = this.processed / duration;
        const speedItemsPerS = speedItemsPerMs * 1000;
        if (speedItemsPerS < 1) {
            return `${formatDuration(1 / speedItemsPerS)} / i`;
        }
        return `${Math.round(speedItemsPerS).toLocaleString()} i/s`;
    }

    formatEta(): string {
        const duration = new Date().getTime() - this.startedAt.getTime();
        const speedItemsPerMs = this.processed / duration;
        const remaining = this.total - this.processed;
        const etaMs = remaining / speedItemsPerMs;
        return formatDuration(etaMs);
    }

    formatPct(): string {
        return `${round((this.processed / this.total) * 100, 2).toFixed(2).toLocaleString()}%`;
    }

    formatProgress(): string {
        return `${this.processed.toLocaleString()}/${this.total.toLocaleString()}`;
    }

    format(): string {
        return [
            this.formatPct(),
            this.formatProgress(),
            this.formatDuration(),
            this.formatSpeed(),
            this.formatEta(),
        ].join(' ');
    }
}
