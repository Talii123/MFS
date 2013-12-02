<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%@page import="org.slf4j.LoggerFactory"%>
<%@page import="org.slf4j.Logger"%>

<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
	isErrorPage="true"
	isELIgnored="false"    
%>
		<%-- Log error on server side --%>
	<%!
		public final Logger LOGGER = LoggerFactory.getLogger(this.getClass());
	%>
	
	<%
		
		/*//When the page attribute "isErrorPage" is set to "true" the exception object is available
		exception = pageContext.getException();
		String errorMsg = exception.getCause() != null ? exception.getCause().getMessage() : exception.getMessage();
		LOGGER.error("Error page being created for error: {}", errorMsg);
		//request.setAttribute("exception", exception);*/
		
		LOGGER.error("Error: {}", pageContext.getException());
	%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>Oops!  That's an error.</title>
	<style>
	      html { 
	      	height:100%;
	   		width: 100%;
	   	}
		body {
			color: #000;
			padding: 1.2em;
		}

		span {
			color: #000;
			font-size: 28px;
			line-height: 28px;
			font-weight: bold;
		}

	    img.beta {position: fixed; bottom: 0px; right: 0px;}

		img.betaBot{
			position: absolute;
			top: 12em;
			left: 9em;
			z-index: 1;
		}
	</style>

</head>
<body>
	<c:set var="errorsMap" value='${requestScope["error"]}'  />
	<c:choose>
		<c:when test="${!empty errorsMap}">
			<span><c:out value="${errorsMap.msg}" /></span>
			<c:if test="${!empty errorsMap.gotoLink}">
				<br/><br/>
				<span><a href='<c:out value="${errorsMap.gotoLink}" />'><c:out value="${errorsMap.gotoText}" /></a></span>
			</c:if>
		</c:when>
		<c:otherwise>
			<span>Oops, looks like you found an </span><span style="color:red;">ERROR! </span>
			<span>Our BetaBot still has a few kinks to work out.</span><br><br>
	
			<span>We're sorry for any inconvenience and are hard at work to make things better!</span>
		</c:otherwise>
	</c:choose>
	
	<img class="betaBot" src="/images/repairman.jpg" alt="Our Loveable BetaBot" />
	<img class="beta" src="/images/betablack.png" />
</body>

</html>
</body>
</html>