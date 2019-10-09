import "../polyfills";

export default interface ICandidateApi {
  name: string;
  host: string;
  port: number;
  path: string;
  setUp(): void;
  start(): void;
  playground(): void;
  monitor(): void;
  deploy(): void;
  wipeData(): void;
  shutdown(): void;
}
