window.onload = () => {
  let animation = (el, css, delay, callback) => {
    let delta = 10;
    let s = css.style;
    let offset = parseInt(el.style[s]) ? parseInt(el.style[s]) : 0;
    let v = css.value == 0 ? -offset : css.value;
    let ed = css.type;
    let speed = v / (delay / delta);
    let time = Math.abs((v / speed) * delta);

    if (!time) return;

    let start = 0;

    let anim = setInterval(() => {
      let current = start * speed + offset;

      el.style[s] = `${current + ed}`;

      start++;
    }, delta);
    setTimeout(() => {
      clearInterval(anim);
      if (callback) callback();
    }, time + delta);
  };
  let scroll = e => {
    // let y = e.getBoundingClientRect().top - 95;
    // let delay = 10;
    // let t = 200 / delay;
    // let speed = y / t;
    // let time = Math.abs((y / speed) * delay);

    // if (y == 0) return;

    // let i = 0;
    // let a = setInterval(() => {
    //   window.scrollBy(0, speed);
    // }, delay);
    // setTimeout(() => {
    //   clearInterval(a);
    // }, time + delay);

    e.scrollIntoView();
  };
  let toLink = e => {
    let link = e.getAttribute("data-link");
    let linked = document.querySelector(`.${link}`);
    scroll(linked);
  };
  let switchableMenu = e => {
    let menu = e.currentTarget;
    let element = e.target;

    console.log(menu, element);

    if (!element.closest("ul")) return;

    for (let e of menu.children) e.classList.remove("m-active");

    element.classList.add("m-active");

    if (element.hasAttribute("data-link")) toLink(element);
  };
  let sliderControl = e => {
    let t = e.currentTarget;
    let c = e.target;
    console.log(t, c);
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

    animation(
      slider,
      { style: "left", value: -100 * index, type: "%" },
      300,
      () => {
        delete t.isStarted;
      }
    );

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
          A += Math.random() * (4 - 1) + 1;
          B += Math.random() * (4 - 1) + 1;
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

    console.log(c);

    c.closest(".window").remove();
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

  document.querySelector(".nav-list").addEventListener("click", switchableMenu);
  document
    .querySelector(".menu-list")
    .addEventListener("click", switchableMenu);
  document.querySelector(".menu-list").addEventListener("click", randomMoves);
  document.querySelector(".slider").addEventListener("click", sliderControl);
  document.querySelector(".slider").addEventListener("click", toggleScreen);
  document.querySelector(".content").addEventListener("click", clickableImages);
  document.querySelector("form").addEventListener("submit", btnSubmit);
};
