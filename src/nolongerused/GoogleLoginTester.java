import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;


public class GoogleLoginTester {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		//simpleLogin();
		StringBuilder content = new StringBuilder();
		simpleConnect("http://localhost:8888/hello", "PUT", content);
	}
	
	

	private static void simpleLogin() {
		try {
			StringBuilder content = new StringBuilder();
			appendTesterCredentials(content);
			//content.append("&service=").append(URLEncoder.encode(yourapp, "UTF-8"));
			simpleConnect("https://mail.google.com", "POST", content);			
		} catch (Exception e) {
			System.err.println(e);
		}
	}



	private static void appendTesterCredentials(StringBuilder content)
			throws UnsupportedEncodingException {
		content.append("Email=").append(URLEncoder.encode("johnny.test.appengine", "UTF-8"));
		content.append("&Passwd=").append(URLEncoder.encode("This is a test/1234/", "UTF-8"));
	}
	
	private static void simpleConnect(String url, String requestMethod, StringBuilder content) {
		BufferedReader reader;
		String line;
		try {
			//Open the Connection
			HttpURLConnection urlConnection = (HttpURLConnection) new URL(url).openConnection();
			urlConnection.setRequestMethod(requestMethod);
			urlConnection.setDoInput(true);
			urlConnection.setDoOutput(true);
			urlConnection.setUseCaches(false);
			urlConnection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

			// Form the POST parameters

			OutputStream outputStream = urlConnection.getOutputStream();
			outputStream.write(content.toString().getBytes("UTF-8"));
			outputStream.close();

			// Retrieve the output
			int responseCode = urlConnection.getResponseCode();
			System.out.println("responseCode: " + responseCode);
			InputStream inputStream;
			if (responseCode == HttpURLConnection.HTTP_OK) {
			  inputStream = urlConnection.getInputStream();
			} else {
			  inputStream = urlConnection.getErrorStream();
			}
			
			reader = new BufferedReader(new InputStreamReader(inputStream));
			while ((line = reader.readLine()) != null) {
				System.out.println(line);
			}
			reader.close();
			
		} catch (Exception e) {
			System.err.println(e);
		}
	}

}
