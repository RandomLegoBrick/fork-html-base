document.addEventListener("DOMContentLoaded", function(){
	document.querySelectorAll(".ripple").forEach(function(item){
		item.addEventListener("click", function(e){
			var d = document.createElement("div");//div
			let pos = item.getBoundingClientRect();
			d.style.left = (e.clientX-5-pos.left)+"px";
			d.style.top = (e.clientY-5-pos.top)+"px";
			d.classList.add("grow");
			item.appendChild(d);
			setTimeout(function() {
				item.removeChild(d);
			}, 1000);
		});
	}); 
});