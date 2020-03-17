window.onload = () => {
  let animate = function(cssObj, duration, callback) {
    let start = performance.now();

    //linear timing function
    
    let timing = t => t;

    //drawing function default
    
    let draw = (s, p) => {
      s.styleObj[s.type] = p * s.newValue + s.prev + s.ed;
    };

    //from css properties object create map structure for convenient use

    let cssMap = new Map(Object.entries(cssObj));

    //for every css properties call animation in for-of cycle

    for (let i of cssMap) {
      // css property name

      let type = i[0];

      //css property value + property unit, two type

      let value, ed;

      //if typeof value string

      if (typeof i[1] == "string") {
        value = parseInt(
          [...i[1]]
            .filter(n => {
              if (/[-0-9]/.test(n)) return n;
            })
            .join("")
        );

        //calculate unit if it is string

        ed = [...i[1]]
          .filter(n => {
            if (/[%a-z]/.test(n)) return n;
          })
          .join("");

        //and if typeof value number
      } else value = i[1];

      //and if property unit is undefined or empty string

      ed = ed ? ed : "";

      let styleObj;

      //define style object, it was done, because some properties are taken
      //from property style, but any are taken directly

      if (type === "scrollTop") styleObj = this;
      else styleObj = this.style;

      //define prevision and new value of the current css property

      let prev = parseInt(styleObj[type]) ? parseInt(styleObj[type]) : 0;
      let newValue = value - prev;

      //and actually call animation loop, using requestAnimationFrame function

      requestAnimationFrame(function animate(time) {
        //define time fraction for control the animation process

        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;

        //using timing function for function curve

        let progress = timing(timeFraction);

        //call drawing function

        draw({ styleObj, type, prev, newValue, ed }, progress);

        //condition for exiting recursion

        if (timeFraction < 1) requestAnimationFrame(animate);

        //and call callback function in the end
        if (progress == 1 && callback)
          requestAnimationFrame(() => {
            callback();
          });
      });
    }
  };
  let scroll = e => {
    let y = e.offsetTop - 95;
    animate.call(document.documentElement, { scrollTop: y }, 300, () => {
      window.addEventListener("scroll", switchOnScroll);
    });
  };
  let toLink = e => {
    let link = e.getAttribute("data-link");
    let linked = document.querySelector(`.${link}`);
    scroll(linked);
  };
  let switchableMenu = e => {
    let menu = e.currentTarget;
    let element = e.target;

    if (!element.closest("ul")) return;

    for (let e of menu.children) e.classList.remove("m-active");

    element.classList.add("m-active");

    window.removeEventListener("scroll", switchOnScroll);

    if (element.hasAttribute("data-link")) toLink(element);
  };
  let sliderControl = e => {
    let t = e.currentTarget;
    let c = e.target;
    if (!c.classList.contains("chev")) return;

    if (t.isStarted) {
      return;
    }
    t.isStarted = true;
    let slider = t.querySelector(".slider-block");
    let dir = c.classList.contains("r");

    let images = slider.children;
    let count = images.length;

    let img = slider.querySelector(".target");

    let index = parseInt(img.getAttribute("index"));

    img.classList.toggle("target");

    switch (dir) {
      case false:
        if (index === 0) {
          index = count - 1;
          break;
        }
        index--;
        break;
      case true:
        if (index === count - 1) {
          index = 0;
          break;
        }
        index++;
        break;
    }

    let cur = -100 * index;

    animate.call(slider, { left: cur + "%" }, 300, () => {
      delete t.isStarted;
    });

    let newIndex = Math.abs(index);
    img = slider.querySelector(`[index="${newIndex}"]`);

    img.classList.toggle("target");
  };
  let randomMoves = e => {
    let c = e.currentTarget;
    let t = e.target;
    let arr = document.querySelectorAll(".content__item");
    let type = t.getAttribute("data-type");

    let newArr = Array.from(arr).sort((a, b) => {
      let A = parseInt(a.firstElementChild.getAttribute("index"));
      let B = parseInt(b.firstElementChild.getAttribute("index"));

      switch (type) {
        case "1":
          if (A > B) return 1;
          if (A < B) return -1;
          if (A == B) return 0;
        case "2":
          if (A > B) return -1;
          if (A < B) return 1;
          if (A == B) return 0;
        case "3":
        case "4":
          A += Math.random() * (10 - 1) + 1;
          B += Math.random() * (10 - 1) + 1;
          if (A > B) return 1;
          if (A < B) return -1;
          if (A == B) return 0;
      }
    });

    for (let i of arr) i.remove();

    document.querySelector(".content").append(...newArr);
  };
  let toggleScreen = e => {
    let c = e.currentTarget;
    let t = e.target;
    let ph = t.classList.contains("v");

    if (!t.classList.contains("btn")) return;

    let screen;

    switch (ph) {
      case true:
        screen = c.querySelectorAll(".screen")[0];
        break;
      case false:
        screen = c.querySelectorAll(".screen")[1];
    }

    if (t.classList.contains("active")) {
      screen.style.display = "none";
    } else screen.style.display = "block";

    t.classList.toggle("active");
  };
  let clickableImages = e => {
    let c = e.currentTarget;
    let t = e.target;

    for (let i of c.children) i.classList.remove("m-active");

    if (!t.parentElement.classList.contains("content__item")) return;

    t.parentElement.classList.toggle("m-active");
  };
  let hideWindow = e => {
    let c = e.currentTarget;
    let w = c.closest(".window");

    animate.call(w, { opacity: 0 }, 100, () => {
      w.remove();
    });
  };
  let showWindow = (e, n) => {
    let w = document.createElement("div");
    w.className = "window";
    w.innerHTML = '<div class="window-content"></div>';

    e.forEach(i => {
      let newField = document.createElement("div");
      newField.classList.add("window-field");

      newField.insertAdjacentHTML("afterbegin", i);

      w.children[0].append(newField);
    });

    w.children[0].insertAdjacentHTML(
      "afterbegin",
      `<div class="window-name">${n}</div>`
    );
    w.children[0].insertAdjacentHTML(
      "beforeend",
      '<div class="window-hide input">OK</div>'
    );

    document.querySelector("main").prepend(w);

    w.style.display = "flex";

    animate.call(w, { opacity: 1 }, 100);

    document
      .querySelector(".window-hide")
      .addEventListener("click", hideWindow);
  };
  let btnSubmit = e => {
    let c = e.currentTarget;
    let subject = c.querySelector("[name='subject']").value
      ? "<b>Subject:</b> " + c.querySelector("[name='subject']").value
      : "Without subject";
    let desc = c.querySelector("[name='desc']").value
      ? "<b>Description:</b>  " + c.querySelector("[name='desc']").value
      : "Without description";
    e.preventDefault();

    showWindow([subject, desc], "The letter was send");
  };
  let switchOnScroll = e => {
    let nav = document.querySelector(".nav-list");

    for (let i of nav.children) {
      if (
        document
          .querySelector("." + i.getAttribute("data-link"))
          .getBoundingClientRect().top <=
        0 + 95
      ) {
        for (let e of nav.children) e.classList.remove("m-active");

        i.classList.add("m-active");
      }
    }
  };

  document.querySelector(".nav-list").addEventListener("click", switchableMenu);
  document
    .querySelector(".menu-list")
    .addEventListener("click", switchableMenu);
  document.querySelector(".menu-list").addEventListener("click", randomMoves);
  document.querySelector(".slider").addEventListener("click", sliderControl);
  document.querySelector(".slider").addEventListener("click", toggleScreen);
  document.querySelector(".content").addEventListener("click", clickableImages);
  document.querySelector("form").addEventListener("submit", btnSubmit);
  window.addEventListener("scroll", switchOnScroll);
};
