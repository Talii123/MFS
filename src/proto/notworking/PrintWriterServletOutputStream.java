package proto.notworking;

import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;

import javax.servlet.ServletOutputStream;

public class PrintWriterServletOutputStream extends ServletOutputStream {

	private final PrintWriter writer;

	public PrintWriterServletOutputStream(OutputStream out) {
		this.writer = new PrintWriter(out);
	}
	
	public PrintWriter getPrintWriter() {
		return this.writer;
	}

	@Override
	public void write(int b) throws IOException {
		writer.write(b);
	}

	@Override
	public void print(boolean arg0) throws IOException {
		writer.print(arg0);
	}

	@Override
	public void print(char c) throws IOException {
		writer.print(c);
	}

	@Override
	public void print(double d) throws IOException {
		writer.print(d);
	}

	@Override
	public void print(float f) throws IOException {
		writer.print(f);
	}

	@Override
	public void print(int i) throws IOException {
		writer.print(i);
	}

	@Override
	public void print(long l) throws IOException {
		writer.print(l);
	}

	@Override
	public void print(String arg0) throws IOException {
		writer.print(arg0);
	}

	@Override
	public void println() throws IOException {
		writer.println();
	}

	@Override
	public void println(boolean b) throws IOException {
		writer.println(b);
	}

	@Override
	public void println(char c) throws IOException {
		writer.println(c);
	}

	@Override
	public void println(double d) throws IOException {
		writer.println(d);
	}

	@Override
	public void println(float f) throws IOException {
		writer.println(f);
	}

	@Override
	public void println(int i) throws IOException {
		writer.println(i);
	}

	@Override
	public void println(long l) throws IOException {
		writer.println(l);
	}

	@Override
	public void println(String s) throws IOException {
		writer.println(s);
	}
}
