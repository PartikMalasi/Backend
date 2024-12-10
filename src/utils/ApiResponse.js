class ApiResponse {
  constructor(data, message = "Success", success, statusCode) {
    this.data = data;
    this.message = message;
    this.success = success;
    this.statusCode = statusCode;
  }
}
export default ApiResponse;
