import angular from "angular";
import template from "./tab.html";
import uuid from "uuid4";

export default {
	bindings: {
		watch: "<",
		isFocused: "<",
		isActive: "<",
	},
	require: {
		tabs: "^"
	},
	controller: TabController,
	template: template,
	transclude: true
};

TabController.$inject = ["$element"];
function TabController($element) {
	var $ctrl = this;
	$ctrl.uuid = uuid();
	$element[0].setAttribute("id", $ctrl.uuid);

	$ctrl.$element = $element;

	$ctrl.$onInit = function () {
		var link = $element.find("a");
		link.on("click", function (event) {
			$ctrl.tabs.handleClick($ctrl, event);
		});
		link.on("focusin", function (event) {
			$ctrl.tabs.handleFocus($ctrl, event);
		});
		link.on("keydown", function (event) {
			$ctrl.tabs.handleKeyDown($ctrl, event);
		});
	};

	$ctrl.$postLink = function () {
		$ctrl.tabs.registerTab(this);
		$element[0].setAttribute("role", "tab");
	};

	$ctrl.$onDestroy = function () {
		$ctrl.tabs.deregisterTab(this);
	};

	$ctrl.$onChanges = function (changes) {
		if (changes.watch) {
			$ctrl.tabs.updateTab(this);
		}
		if (changes.isFocused) {
			if (changes.isFocused.currentValue) {
				$element.find("a").focus();
			}
		}
	};

}