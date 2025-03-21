export class HttpError extends Error {
  get status(): number {
    return this.response.status;
  }

  constructor(
    endpoint: string,
    public readonly response: Response,
  ) {
    super(
      `Failed to fetch ${endpoint}: ${response.status} ${response.statusText}`,
    );
    this.name = "HttpError";
  }
}
