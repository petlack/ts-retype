import { formatDuration, round } from './core.js';

/**
* Tracks the progress of a task.
*/
export class Progress {
    constructor(
        private startedAt: Date,
        private processed: number,
        private total: number,
    ) {}

    /**
    * Creates a finite progress tracker.
    */
    static finite(total: number): Progress {
        return new Progress(new Date(), 0, total);
    }

    /**
    * Creates an infinite progress tracker.
    */
    static infinite(): Progress {
        return Progress.finite(0);
    }

    /**
    * Sets the total number of steps.
    */
    setTotal(total: number) {
        this.total = total;
    }

    /**
    * Advances the progress by the given number of steps.
    */
    advanceBy(steps: number) {
        this.processed += steps;
    }

    /**
    * Advances the progress by one step.
    */
    advance() {
        this.advanceBy(1);
    }

    /**
    * Sets the number of steps processed.
    */
    setProcessed(processed: number) {
        this.processed = processed;
    }

    /**
    * Resets the progress tracker.
    */
    reset() {
        this.startedAt = new Date();
        this.processed = 0;
    }

    /**
    * Formats the duration of the task.
    * @example '1m 12s'
    */
    formatDuration(): string {
        const ms = new Date().getTime() - this.startedAt.getTime();
        return formatDuration(ms);
    }

    /**
    * Formats the speed of the task.
    * @example '12.34 i/s'
    */
    formatSpeed(): string {
        const duration = new Date().getTime() - this.startedAt.getTime();
        const speedItemsPerMs = this.processed / duration;
        const speedItemsPerS = speedItemsPerMs * 1000;
        if (speedItemsPerS < 1) {
            return `${formatDuration(1 / speedItemsPerS)} / i`;
        }
        return `${Math.round(speedItemsPerS).toLocaleString()} i/s`;
    }

    /**
    * Formats the estimated time of completion.
    * @example '12s'
    */
    formatEta(): string {
        const duration = new Date().getTime() - this.startedAt.getTime();
        const speedItemsPerMs = this.processed / duration;
        const remaining = this.total - this.processed;
        const etaMs = remaining / speedItemsPerMs;
        return formatDuration(etaMs);
    }

    /**
    * Formats the percentage of completion.
    * @example '12.34%'
    */
    formatPct(): string {
        return `${round((this.processed / this.total) * 100, 2).toFixed(2).toLocaleString()}%`;
    }

    /**
    * Formats the progress of the task.
    * @example '123/1,987'
    */
    formatProgress(): string {
        return `${this.processed.toLocaleString()}/${this.total.toLocaleString()}`;
    }

    /**
    * Formats the progress of the task.
    */
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
