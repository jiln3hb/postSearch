var projectUtil = {

	showMyAlert : function showMyAlert(heading, message, position, onOk, onClose) {
		
		var vertical_align = null;
		var marginAuto = false;
		var isFloatRight = false;
		if (position == projectUtil.positions.TOP || position == projectUtil.positions.CENTER || position == projectUtil.positions.BOTTOM) {
			marginAuto = "margin:auto;";
		}

		if (position != projectUtil.positions.LEFT_TOP && position != projectUtil.positions.TOP && position != projectUtil.positions.RIGHT_TOP) {

			if (position == projectUtil.positions.LEFT_CENTER || position == projectUtil.positions.CENTER || position == projectUtil.positions.RIGHT_CENTER) {
				vertical_align = "middle";
			} else {
				vertical_align = "bottom";
			}
		}

		if (position == projectUtil.positions.RIGHT_TOP || position == projectUtil.positions.RIGHT_CENTER || position == projectUtil.positions.RIGHT_BOTTOM) {
			isFloatRight = true;
		}

		$('body').append(generateHTML(vertical_align, marginAuto, isFloatRight, heading, message, onOk, onClose));

	},

	alertOK : function(id, callback) {
		
		if (callback)
			callback();

		$("#" + id).remove();

	},
	alertClose : function(id, callback) {
		if (callback)
			callback();

		$("#" + id).remove();

	},
	showAllAlerts : function showAllAlerts() {

		projectUtil.showMyAlert("Alert positioned Top Left", "This alert box is positioned ", projectUtil.positions.LEFT_TOP, projectUtil.onOK, projectUtil.onClose);
		projectUtil.showMyAlert("Alert positioned Top Center", "This alert box is positioned top-center", projectUtil.positions.TOP, projectUtil.onOK, projectUtil.onClose);
		projectUtil.showMyAlert("Alert positioned Top Right", "This alert box is positioned top-right", projectUtil.positions.RIGHT_TOP, projectUtil.onOK, projectUtil.onClose);
		projectUtil.showMyAlert("Alert positioned Middle Left", "This alert box is positioned middle-left", projectUtil.positions.LEFT_CENTER, projectUtil.onOK, projectUtil.onClose);
		projectUtil.showMyAlert("Alert positioned Middle Center", "This alert box is positioned middle-center", projectUtil.positions.CENTER, projectUtil.onOK, projectUtil.onClose);
		projectUtil.showMyAlert("Alert positioned Middle Right", "This alert box is positioned middle-right", projectUtil.positions.RIGHT_CENTER, projectUtil.onOK, projectUtil.onClose);
		projectUtil.showMyAlert("Alert positioned Bottom Left", "This alert box is positioned bottom-left", projectUtil.positions.LEFT_BOTTOM, projectUtil.onOK, projectUtil.onClose);
		projectUtil.showMyAlert("Alert positioned Bottom Center", "This alert box is positioned bottom-center", projectUtil.positions.BOTTOM, projectUtil.onOK, projectUtil.onClose);
		projectUtil.showMyAlert("Alert positioned Bottom Right", "This alert box is positioned bottom-right", projectUtil.positions.RIGHT_BOTTOM, projectUtil.onOK, projectUtil.onClose);

	},

	onOK : function() {

		projectUtil.showMyAlert("OnClickFunction", "", projectUtil.positions.CENTER, null, projectUtil.onClose);
	},
	onClose : function() {
		console.log("alert close");
	},
	positions : {
		LEFT_TOP : 0,
		TOP : 1,
		RIGHT_TOP : 2,
		LEFT_CENTER : 3,
		CENTER : 4,
		RIGHT_CENTER : 5,
		LEFT_BOTTOM : 6,
		BOTTOM : 7,
		RIGHT_BOTTOM : 8
	}

};

function generateHTML(verticalAlign, marginAuto, isFloatRight, heading, message, onClickOk, onClickClose) {

	var id = new Date().getTime() + (Math.floor(Math.random() * 100000) + 1);

	var divOverlay = document.createElement("div");
	divOverlay.id = id;
	divOverlay.classList.add("alertoverlay");

	var divTableCell = document.createElement("div");

	divTableCell.style.display = "table-cell";
	divTableCell.style.textAlign = "center";
	if (verticalAlign) {
		if (verticalAlign == "middle")
			divTableCell.style.verticalAlign = "middle";
		else
			divTableCell.style.verticalAlign = "bottom";

	}

	var divAlert = document.createElement("div");
	divAlert.classList.add("alert_popup");

	if (marginAuto) {
		divAlert.style.margin = "auto";
	}

	if (isFloatRight) {
		divAlert.style.float = "right";
	}

	var h2 = document.createElement("h2");

	var text = document.createTextNode(heading);
	// Create a text node
	h2.appendChild(text);

	var okButton = document.createElement("button");

	okButton.classList.add("my-alert-btn");
	var funOk = function() {
		projectUtil.alertOK(id, onClickOk);
	};

	okButton.onclick = funOk;
	text = document.createTextNode("OK");
	// Create a text node
	okButton.appendChild(text);

	var closeButton = document.createElement("button");

	closeButton.classList.add("my-alert-btn");
	var funClose = function() {
		projectUtil.alertClose(id, onClickClose);
	};

	closeButton.onclick = funClose;
	text = document.createTextNode("Close");
	// Create a text node
	closeButton.appendChild(text);
	var messageDiv = document.createElement("div");

	messageDiv.classList.add("alert_content");
	text = document.createTextNode(message);
	// Create a text node
	messageDiv.appendChild(text);
	divAlert.appendChild(h2);

	divAlert.appendChild(messageDiv);
	divAlert.appendChild(okButton);
	//divAlert.appendChild(closeButton);
	divTableCell.appendChild(divAlert);
	divOverlay.appendChild(divTableCell);

	return divOverlay;

}