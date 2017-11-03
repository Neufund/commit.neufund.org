import * as $ from "jquery";
import { throttle } from "lodash";
import "owl.carousel";
import * as vexDialog from "vex-dialog";
import * as vex from "vex-js";

import "!style-loader!css-loader!vex-js/dist/css/vex-theme-os.css";
import "!style-loader!css-loader!vex-js/dist/css/vex.css";
import "bootstrap-sass/assets/javascripts/bootstrap.js";
import "./effects.js";
import "./faqScroll";
import { handleMailChimpSubscribe } from "./ga";
import { getPersonModal } from "./personModal";
import "./scroll.js";
import scrollbarFix from "./scrollbarFix";

vex.defaultOptions.className = "vex-theme-os";
vex.registerPlugin(vexDialog);

handleMailChimpSubscribe();

const getParticipateModal: any = (text: string) => {
  return {
    unsafeContent: `
      <div class="row">
        <div class="col-md-12">
          ${text}
        </div>
      </div>`,
  };
};

$(() => {
  const seeMore: string = "+ More";
  const seeLess: string = "- Less";

  $("body").faqScroll({
    sidebarArea: "#sidebar",
    offset: 80,
    speed: 100,
  });

  $(".person-block").click(function() {
    // ehh we should rewrite it later. Lets just bundle these data in js (not html blob).
    const name = $(this).find("h4.name").text().trim();
    const image = $(this).find("img").attr("src").trim();
    const title = $(this).find("h4.position-hidden").html();
    const bio = $(this).find(".bio").text().trim();
    const rawLinks = $(this).find(".links").text().trim();
    const links = rawLinks ? JSON.parse(rawLinks) : {};
    const email = $(this).find("p.link").text().trim();

    vex.open(getPersonModal(name, image, title, bio, links, email));
  });

  $(".team .see-more").click(function() {
    $(this).text().trim().toLowerCase() === seeMore.trim().toLowerCase()
      ? $(this).text(seeLess)
      : $(this).text(seeMore);
    $(".team .is-hidden").fadeToggle("slow", "linear");
  });

  $(".comming-soon").click(function(e) {
    e.preventDefault();
    const text = $(this).text();
    vex.open(getParticipateModal(`<h4>${text}</h4> <p class="slim">Coming soon</p>`));
  });

  $(".faq .show-answer").click(function(e) {
    e.preventDefault();

    const pTag: any = $(this).siblings(".answer")[0];
    const iconTag: any = $(this).find(".material-icons")[0];

    if ($(pTag).is(":visible")) {
      $(pTag).slideUp();
      $(iconTag).html("keyboard_arrow_down");
    } else {
      $(pTag).slideDown();
      $(iconTag).html("keyboard_arrow_up");
    }
  });

  $(window).scroll(
    throttle(
      () => {
        const scroll: number = $(window).scrollTop();
        const headerSelector: string = ".navbar.navbar-default.navbar-fixed-top";
        if (scroll < 20) {
          if ($(headerSelector).hasClass("border")) {
            $(headerSelector).removeClass("border");
          }
        } else {
          if (!$(headerSelector).hasClass("border")) {
            $(headerSelector).addClass("border");
          }
        }
      },
      200,
      { trailing: true }
    )
  );

  $('a[href*="#how-it-works"],a[href*="#why-participate"]').click(function(e) {
    e.preventDefault();
    // the destination id will be taken from the href attribute
    const dest = $(this).attr("href");
    if (dest === "#") {
      return;
    }
    const target = $(dest);
    $("html, body").stop().animate(
      {
        scrollTop: target.offset().top,
      },
      1000
    );
  });

  scrollbarFix();

  $(".has-carousel").owlCarousel({
    navigation: true,
    loop: true,
    items: 1,
    dots: true,
    autoplay: true,
    autoplayTimeout: 10000,
  });
});
