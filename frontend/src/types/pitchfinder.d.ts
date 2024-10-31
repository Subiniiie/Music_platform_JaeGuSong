declare module "pitchfinder" {
  export class YIN {
    constructor();
    findPitch(buffer: Float32Array): number | null;

    options?: {
      sampleRate?: number;
      threshold?: number;
    };
  }
}
