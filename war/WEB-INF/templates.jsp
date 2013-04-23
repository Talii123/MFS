<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" isELIgnored="true" %>

<!-- begin templates.jsp -->

    <%@ include file="/templates/general.jqtmpl" %>
    
   
    <%@ include file="/templates/eventFormatting.jqtmpl" %>
   
   <%  
   
   			String isEditableParam = request.getParameter("isEditable");	
   			if (isEditableParam == null || isEditableParam.length() <= 0) isEditableParam = "false";
			if (Boolean.parseBoolean(isEditableParam)) {
   		
   	%> 
    		<%@ include file="/templates/inputForm.jqtmpl" %>
    <%
			}
    %>
    
    <!--  end templates.jsp -->