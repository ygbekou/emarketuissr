export class Constants {
	// Local
	public static apiServer = 'http://localhost:8080';
	public static webServer = 'http://localhost:4200';

	// PROD
	//public static apiServer = 'https://www.kekouda.com/emarket';
	//public static webServer = 'https://www.kekouda.com';

	// CADER
	// public static apiServer = 'https://ec2-3-212-229-205.compute-1.amazonaws.com/emarket';
	// public static webServer = 'https://ec2-3-212-229-205.compute-1.amazonaws.com';

	public static SUCCESS = 'success';
	public static INFO = 'info';
	public static WARN = 'warn';
	public static ERROR = 'error';
	public static DATE_FORMAT = 'MM/dd/yyyy';
	public static ORDER_WAIT_TIME = 120000;

	public static PROCESSING_FEE_PERC = 0.05;
}
