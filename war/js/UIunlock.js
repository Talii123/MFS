(function() {
	//console.log("unlocking UI if it's locked...");
	if (window.isUIDisabled) {
		console.log("UI is disabled.");
		$("body").off("click", disableUI);	
		console.log("UI is now enabled.");
	}
	else {
		console.log("UI is not disabled.");
	}
})();