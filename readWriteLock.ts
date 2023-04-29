export class ReadWriteLock {
    private readCount: number;
    private writeCount: number;
  
    constructor() {
      this.readCount = 0;
      this.writeCount = 0;
    }
  
    async acquireReadLock(): Promise<void> {
      while (this.writeCount > 0) {
        await this.delay(10);
      }
      this.readCount++;
    }
  
    releaseReadLock(): void {
      this.readCount--;
    }
  
    async acquireWriteLock(): Promise<void> {
      while (this.readCount > 0 || this.writeCount > 0) {
        await this.delay(10);
      }
      this.writeCount++;
    }
  
    releaseWriteLock(): void {
      this.writeCount--;
    }
  
    private delay(ms: number): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
  }
  