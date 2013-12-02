package test;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import friedman.tal.util.Utils;

public class InputTooLargeServlet extends HttpServlet {

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		System.out.println("\n\n\n\n Too large servlet is running!!! \n\n\n\n");
		Utils.read(req.getInputStream()); 
	}

	
}
