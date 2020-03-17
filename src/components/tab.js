import angular from "angular";
import template from "./tab.html";
import uuid from "uuid4";

export default {
	bindings: {
		watch: "<",
		sref: "@"
	},
	require: {
		tabs: "^"
	},
	controller: TabController,
	template: template,
	transclude: true
};

TabController.$inject = ["$timeout", "$element", "$location"];
function TabController($timeout, $element, $location) {
	var $ctrl = this;
	$ctrl.uuid = "tab-" + uuid();
	$element[0].setAttribute("id", $ctrl.uuid);

	// DEBUG
	$ctrl.$element = $element;

	$ctrl.$postLink = function () {
		// Make sure parent (tabs) controller knows about this tab
		$ctrl.tabs.registerTab(this);
		// Necessary for accessibility
		$element[0].setAttribute("role", "tab");
		// Set up event handlers -> parent context
		var link = $element.find("a");
		link.on("focusin", function (event) {
			// Make parent controller aware of which tab is focused
			$ctrl.tabs.handleFocus($ctrl, event);
		});
		link.on("keydown", function (event) {
			// enter key will just activate the link, parent controller doesn't need to do anything
			if (event.keyCode !== 13) {
				$ctrl.tabs.handleKeyDown($ctrl, event);
			}
		});
	};

	$ctrl.$onDestroy = function () {
		// If this tab disappears (ng-if or whatever), let the parent controller forget about keeping it updated
		$ctrl.tabs.deregisterTab(this);
	};

	// If any of the "watched" properties change, the parent tabs controller needs to process any changes
	$ctrl.$onChanges = function (changes) {
		if (changes.watch) {
			$ctrl.tabs.handleTabUpdate(this);
		}
	};

}