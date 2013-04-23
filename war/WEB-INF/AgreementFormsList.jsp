<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="friedman.tal.mfs.agreements.AgreementFormResource,friedman.tal.mfs.agreements.IAgreementForm"  %>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>Agreement Forms List</title>
	
	<link type="text/css" rel="stylesheet" href="/css/app.css">
	<link type="text/css" rel="stylesheet" href="/css/editUI.css">	
	
	<style>
		#main {
			width: 80%;
			margin: auto;
		}
		textarea {
			width: 80%
		}
		.inline-block {
			display: inline-block;
			margin-right: 2em;
		}
	</style>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
	<script>
		$(function() {
			
			var switcher = function(config) {
				var selectJQS,
						textareaJQS,
						$select,
						select,
						$textarea,
						revisionNum,
						initialText,
						
						switchToNew = function() {									
							select.selectedIndex = select.options.length-1;
							//$select.change();
							
							$(this).off("keypress");
						};
				
				config = config || {};
				selectJQS = config.selectJQS;
				textareaJQS = config.textareaJQS;
				
				revisionNum = config.revisionNum;				
				
				$select = $(selectJQS);
				select = $select[0];
				$textarea = $(textareaJQS);
				initialText = $textarea.val();			
				
				// initially, textarea's value is the text corresponding to revisionNum, so save it for later
				$select.data(revisionNum, initialText)
				.data("new", initialText)
				.on("change", function() {
						//var toRestore = $(this).data("hiddenRevision"),
								//$textArea = $("#agreementTextInputId");
						
						/*$(this).data("hiddenRevision", $textArea.val());
						$textArea.val(toRestore);*/
						
						var $textArea = $(textareaJQS);
						
						// user switched to an old revision so need to re-enable the function that will trigger a change to the "new" revision number
						// if the user changes anything in the text area
						if (this.selectedIndex < this.options.length-1) {
							$(textareaJQS).on("keypress", switchToNew);
							$(this).data("new", $textArea.val());
							$textArea.val($(this).data(revisionNum));
						}
						else {
							$textArea.val($(this).data("new"));
						}
												
					});
				
				$textarea.on("keypress", switchToNew);
				
			}({
				"selectJQS" : "#revisionSelect",
				"textareaJQS" 	: "#agreementTextInputId",
				"revisionNum" : ""+${currentAgreementForm.revisionNum}
			});
			
		});

	</script>
</head>
<body>
	<div id="main">
		<h1>Agreement Forms List</h1>
		
		<c:choose>
			<c:when test="${!empty agreementForms}">
				<table>
					<thead>
						<tr>
							<th>Agreement Form Name</th><th>Revisions</th>
						</tr>
					</thead>
					<tbody>
						<c:forEach items="${agreementForms}" var="entry">	
							<%-- not strictly needed, but it's clearer this way --%>
							<c:set var="name" value="${entry.key}"/>
							<tr>
								<td>${name}</td>
								<td>
									<c:forEach items="${entry.value}" var="agreementForm" varStatus="loopStatus"><c:set var="revisionNum" value="${agreementForm.revisionNum}"></c:set> <a href="/admin/agreementForms/${name}-${revisionNum}">${revisionNum}</a> ${!loopStatus.last ? ', ' : ''}</c:forEach> 
								</td>				
							</tr>
						</c:forEach>	
					</tbody>
				</table>			
			</c:when>
			<c:otherwise>
				<c:choose>
					<c:when test="${empty currentAgreementForm}">
						<p>No Agreement Forms exist</p>
					</c:when>
					<c:otherwise>
						<a href="/admin/agreementForms">Go back to Agreement Forms List</a>
					</c:otherwise>
				</c:choose>				
			</c:otherwise>
		</c:choose>
		<c:choose>
			<c:when test="${!empty currentAgreementForm}">
				<form action="/admin/agreementForms" method="post" enctype="application/x-www-form-urlencoded">
					<input name="agreementName" type="hidden" value="${currentAgreementForm.name}"></input>
					<fieldset>
						<legend>Create new revision of Agreement Form named ${currentAgreementForm.name}</legend>
						<div class="inline-block"><label for="agreementNameInputId">Agreement Name</label><input name="agreementName" id="agreementNameInputId" type="text" value="${currentAgreementForm.name}" disabled="disabled"></input></div>
						<div class="inline-block"><label for="revisionSelect">Revision Number: </label>
						<select id="revisionSelect">
							<option selected="selected">${ currentAgreementForm.revisionNum}</option>
							<option>New</option>
						</select></div>
						<br/>
						<label for="agreementTextInputId">Agreement Text</label><textarea name="agreementText" id="agreementTextInputId" rows="25">${currentAgreementForm.text}</textarea><br/>
						<input type="submit" value="Save New Revision" />			
					</fieldset>
				</form>				
			</c:when>
			<c:otherwise>
				<form action="/admin/agreementForms" method="post" enctype="application/x-www-form-urlencoded">
					<fieldset>
						<legend>Create new agreement form</legend>
						<label for="agreementNameInputId">Agreement Name</label><input name="agreementName" id="agreementNameInputId" type="text"></input>
						
						<br/>
						<label for="agreementTextInputId">Agreement Text</label><textarea name="agreementText" id="agreementTextInputId" rows="25"></textarea><br/>
						<input type="submit" value="Create New Agreement Form" />			
					</fieldset>
				</form>				
			</c:otherwise>
		</c:choose>
		

	</div>
</body>
</html>