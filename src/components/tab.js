import angular from "angular";
import template from "./tab.html";
import uuid from "uuid4";

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

	var setupWatchers = function () {
		// if ($ctrl.watch) {
		// 	var watchList;
		// 	if (!Array.isArray($ctrl.watch)) {
		// 		watchList = [];
		// 		watchList.push($ctrl.watch);
		// 	}
		// 	else {
				
		// 	}
		// }
	};

	$ctrl.$postLink = function () {
		$ctrl.uuid = uuid();
		$ctrl.tabs.registerTab(this);
		console.log("hello", $ctrl.tabs.registerTab);
	};

	$ctrl.$onDestroy = function () {
		$ctrl.tabs.deregisterTab(this);
	};

	$ctrl.$onChanges = function (changes) {
		$ctrl.tabs.updateTab(this);
	};

}