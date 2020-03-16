import angular from "angular";
import template from "./tab.html";

export default {
	bindings: {
		watch: "<",
	},
	require: {
		tabs: "^"
	},
	controller: TabController,
	template: template,
	transclude: true
};

function TabController() {
	var $ctrl = this;

	$ctrl.$postLink = function () {
		$ctrl.tabs.registerTab(this);
	};

	$ctrl.$onDestroy = function () {
		$ctrl.tabs.deregisterTab(this);
	};

	$ctrl.$onChanges = function (changes) {
		if (changes.watch) {
			$ctrl.tabs.updateTab(this);
		}
	};

}