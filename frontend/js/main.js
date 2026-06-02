const state = {
  services: {},
  addOns: {},
  locations: [],
  stillCategories: [],
  stills: [],
  selectedStill: null,
  lastEstimate: null,
};

const WHATSAPP_NUMBER = "917569731440";

const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function option(value, label) {
  return `<option value="${value}">${label}</option>`;
}

function getCheckedAddOns(container = document) {
  return Array.from(
    container.querySelectorAll('input[name="addOns"]:checked'),
  ).map((input) => input.value);
}

function getSelectLabel(id) {
  const select = document.getElementById(id);
  return select?.selectedOptions?.[0]?.textContent || "";
}

function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function quickWhatsAppMessage() {
  return [
    "Hi Moon Light Studios,",
    "I want to know about your affordable photography packages.",
    "Please share available slots, prices, and booking details.",
  ].join("\n");
}

function estimateWhatsAppMessage() {
  const total = state.lastEstimate
    ? rupees.format(state.lastEstimate.total)
    : document.getElementById("estimateTotal").textContent;
  return [
    "Hi Moon Light Studios,",
    "I checked the website estimate and want to confirm this booking.",
    `Service: ${getSelectLabel("calcService")}`,
    `Package: ${getSelectLabel("calcPackage")}`,
    `City: ${getSelectLabel("calcCity")}`,
    `Time: ${getSelectLabel("calcTime")}`,
    `Estimated total: ${total}`,
    "Please confirm availability and payment options.",
  ].join("\n");
}

function bookingWhatsAppMessage(payload, bookingId, estimatedPrice) {
  const service =
    state.services[payload.serviceType]?.label || payload.serviceType;
  const selectedPackage =
    state.services[payload.serviceType]?.packages?.[payload.packageType]
      ?.label || payload.packageType;
  return [
    "Hi Moon Light Studios,",
    "I submitted a booking request from the website.",
    `Booking ID: ${bookingId}`,
    `Name: ${payload.fullName}`,
    `Phone: ${payload.phone}`,
    payload.alternatePhone ? `Alternate phone: ${payload.alternatePhone}` : "",
    `Service: ${service}`,
    `Package: ${selectedPackage}`,
    `City: ${payload.city}`,
    `Preferred date: ${payload.preferredDate}`,
    `Preferred time: ${payload.preferredTime}`,
    payload.address ? `Venue/address: ${payload.address}` : "",
    payload.specialRequests ? `Project brief: ${payload.specialRequests}` : "",
    `Website estimate: ${rupees.format(estimatedPrice)}`,
    "Please confirm availability and next steps.",
  ]
    .filter(Boolean)
    .join("\n");
}

function stillWhatsAppMessage(still = state.selectedStill) {
  return [
    "Hi Moon Light Studios,",
    "I liked this still idea from your website.",
    still ? `Category: ${still.categoryLabel}` : "Category: Not selected",
    still ? `Still idea: ${still.title}` : "Still idea: Please suggest one",
    "Please tell me the best package and available slot for this style.",
  ].join("\n");
}

function fillServiceSelect(select, selected = "wedding") {
  select.innerHTML = Object.entries(state.services)
    .map(([key, service]) => option(key, service.label))
    .join("");
  select.value = selected;
}

function fillPackageSelect(
  select,
  serviceKey = "wedding",
  selected = "standard",
) {
  const service = state.services[serviceKey] || state.services.wedding;
  select.innerHTML = Object.entries(service.packages)
    .map(([key, pack]) =>
      option(key, `${pack.label} - ${rupees.format(pack.price)}`),
    )
    .join("");
  select.value = service.packages[selected]
    ? selected
    : Object.keys(service.packages)[0];
}

function fillCitySelect(select) {
  select.innerHTML =
    option("", "Select city") +
    state.locations
      .map((location) => option(location.city, location.city))
      .join("");
}

async function updateEstimate() {
  const payload = {
    serviceType: document.getElementById("calcService").value,
    packageType: document.getElementById("calcPackage").value,
    city: document.getElementById("calcCity").value,
    preferredTime: document.getElementById("calcTime").value,
    addOnKeys: getCheckedAddOns(document.getElementById("pricingForm")),
  };

  if (!payload.serviceType || !payload.packageType || !payload.city) return;

  const result = await API.estimate(payload);
  const estimate = result.data;
  state.lastEstimate = estimate;
  document.getElementById("estimateTotal").textContent = rupees.format(
    estimate.total,
  );
  document.getElementById("estimateBreakdown").innerHTML = `
    <span><b>Package</b>${rupees.format(estimate.basePrice)}</span>
    <span><b>Travel</b>${rupees.format(estimate.travelCharge)}</span>
    <span><b>Add-ons</b>${rupees.format(estimate.addOnTotal)}</span>
    <span><b>Night charge</b>${rupees.format(estimate.nightCharge)}</span>
  `;
  document.getElementById("estimateWhatsApp").href = whatsappUrl(
    estimateWhatsAppMessage(),
  );
}

function renderServices() {
  document.getElementById("servicesGrid").innerHTML = Object.entries(
    state.services,
  )
    .map(([key, service]) => {
      const starting = Math.min(
        ...Object.values(service.packages).map((pack) => pack.price),
      );
      const featuredPackages = Object.values(service.packages).slice(0, 3);
      return `
      <article class="service-card">
        <h3>${service.label}</h3>
        <p>${service.description}</p>
        <p class="price-line">Starts at ${rupees.format(starting)}</p>
        <ul class="package-list">
          ${featuredPackages.map((pack) => `<li><strong>${pack.label} - ${rupees.format(pack.price)}</strong><span>${pack.includes.slice(0, 2).join(" . ")}</span></li>`).join("")}
        </ul>
        <div class="chip-row">
          ${Object.values(service.packages)
            .map((pack) => `<span>${pack.label}</span>`)
            .join("")}
        </div>
        <p class="budget-note">Advance booking and split payment available on bigger plans.</p>
        <a class="button ghost" href="#booking" data-service="${key}">Plan this shoot</a>
      </article>
    `;
    })
    .join("");

  document.querySelectorAll("[data-service]").forEach((link) => {
    link.addEventListener("click", () => {
      document.getElementById("bookingService").value = link.dataset.service;
      fillPackageSelect(
        document.getElementById("bookingPackage"),
        link.dataset.service,
      );
    });
  });
}

function renderLocations() {
  document.getElementById("locationsGrid").innerHTML = state.locations
    .map(
      (location) => `
    <article class="location-card">
      <h3>${location.city}</h3>
      <p>${location.district} district . ${location.region}</p>
      <p class="price-line">Travel slab: ${rupees.format(location.travelCharge)}</p>
      <div class="chip-row">
        ${location.highlights
          .slice(0, 3)
          .map((highlight) => `<span>${highlight}</span>`)
          .join("")}
      </div>
    </article>
  `,
    )
    .join("");
}

async function renderStills(category = "") {
  const result = await API.getStills(category);
  state.stillCategories = result.data.categories;
  state.stills = result.data.stills;
  state.selectedStill = state.stills[0] || null;

  document.getElementById("stillsTabs").innerHTML = [
    `<button class="${category ? "" : "active"}" type="button" data-still-category="">All</button>`,
    ...state.stillCategories.map(
      (item) =>
        `<button class="${item.key === category ? "active" : ""}" type="button" data-still-category="${item.key}">${item.label}</button>`,
    ),
  ].join("");

  document.getElementById("stillsCount").textContent =
    `${state.stills.length} still ideas ready`;
  document.getElementById("stillsGrid").innerHTML = state.stills
    .map(
      (still, index) => `
    <article class="still-card ${index === 0 ? "selected" : ""}" data-still-id="${still.id}">
      <img src="${still.imageUrl}" alt="${still.prompt}" loading="lazy">
      <span>${still.categoryLabel}</span>
      <h3>${still.title}</h3>
      <p>${still.id}</p>
    </article>
  `,
    )
    .join("");

  document.getElementById("stillsWhatsApp").href = whatsappUrl(
    stillWhatsAppMessage(),
  );
}

function setupStills() {
  const tabs = document.getElementById("stillsTabs");
  const grid = document.getElementById("stillsGrid");
  const whatsapp = document.getElementById("stillsWhatsApp");

  tabs.addEventListener("click", async (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    await renderStills(button.dataset.stillCategory);
  });

  grid.addEventListener("click", (event) => {
    const card = event.target.closest(".still-card");
    if (!card) return;
    state.selectedStill =
      state.stills.find((item) => item.id === card.dataset.stillId) ||
      state.selectedStill;
    document
      .querySelectorAll(".still-card")
      .forEach((item) => item.classList.toggle("selected", item === card));
    whatsapp.href = whatsappUrl(stillWhatsAppMessage());
  });

  whatsapp.addEventListener("click", () => {
    whatsapp.href = whatsappUrl(stillWhatsAppMessage());
  });
}

async function renderGallery(category = "") {
  const result = await API.getGallery(category);
  document.getElementById("galleryGrid").innerHTML = result.data
    .map(
      (item) => `
    <article class="gallery-card">
      <img src="${item.imageUrl}" alt="${item.title}" loading="lazy">
      <span>${item.title}</span>
    </article>
  `,
    )
    .join("");
}

function setupSelectors() {
  ["calcService", "bookingService"].forEach((id) =>
    fillServiceSelect(document.getElementById(id)),
  );
  fillPackageSelect(document.getElementById("calcPackage"));
  fillPackageSelect(document.getElementById("bookingPackage"));
  ["citySelector", "calcCity", "bookingCity"].forEach((id) =>
    fillCitySelect(document.getElementById(id)),
  );
  document.getElementById("calcCity").value = "Visakhapatnam";

  document.querySelectorAll("[data-addon-label]").forEach((label) => {
    const addOn = state.addOns[label.dataset.addonLabel];
    if (addOn)
      label.textContent = `${addOn.label} - ${rupees.format(addOn.price)}`;
  });

  document.getElementById("calcService").addEventListener("change", (event) => {
    fillPackageSelect(
      document.getElementById("calcPackage"),
      event.target.value,
    );
    updateEstimate();
  });
  document
    .getElementById("bookingService")
    .addEventListener("change", (event) => {
      fillPackageSelect(
        document.getElementById("bookingPackage"),
        event.target.value,
      );
    });
  document
    .getElementById("pricingForm")
    .addEventListener("change", updateEstimate);

  document
    .getElementById("citySelector")
    .addEventListener("change", (event) => {
      const location = state.locations.find(
        (item) => item.city === event.target.value,
      );
      document.getElementById("cityResult").textContent = location
        ? `${location.city} is covered 24/7. Travel estimate: ${rupees.format(location.travelCharge)}. Best local spots: ${location.highlights.join(", ")}.`
        : "Select a city to see coverage details.";
    });
}

function setupRevealAnimations() {
  const animatedItems = document.querySelectorAll(
    ".section-heading, .service-card, .quick-card, .promise-card, .location-card, .still-card, .gallery-card, .channel-card, .calculator, .estimate-panel, .booking-form, .contact-panel",
  );
  animatedItems.forEach((item) => item.classList.add("reveal"));

  if (!("IntersectionObserver" in window)) {
    animatedItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -80px", threshold: 0.12 },
  );

  animatedItems.forEach((item) => observer.observe(item));
}

function setupBookingForm() {
  const form = document.getElementById("bookingForm");
  const status = document.getElementById("bookingStatus");
  const confirm = document.getElementById("whatsappConfirm");
  const whatsappLink = document.getElementById("bookingWhatsApp");
  const date = document.getElementById("preferredDate");
  date.min = new Date().toISOString().slice(0, 10);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.classList.remove("error");
    confirm.hidden = true;
    status.textContent = "Sending booking request...";

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    payload.addOnKeys = [];

    try {
      const result = await API.createBooking(payload);
      const message = bookingWhatsAppMessage(
        payload,
        result.data.id,
        result.data.estimatedPrice,
      );
      const url = whatsappUrl(message);
      whatsappLink.href = url;
      confirm.hidden = false;
      status.textContent = `Request saved. Booking ID: ${result.data.id}. Opening WhatsApp with your details...`;
      window.setTimeout(() => {
        window.location.href = url;
      }, 700);
      form.reset();
      setupSelectors();
    } catch (error) {
      status.classList.add("error");
      status.textContent = error.message;
    }
  });
}

function setupWhatsAppLinks() {
  document.querySelectorAll('[data-whatsapp="quick"]').forEach((link) => {
    link.href = whatsappUrl(quickWhatsAppMessage());
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noreferrer");
  });

  const estimateLink = document.getElementById("estimateWhatsApp");
  estimateLink.addEventListener("click", () => {
    estimateLink.href = whatsappUrl(estimateWhatsAppMessage());
  });
}

function setupGalleryFilters() {
  document
    .getElementById("galleryFilters")
    .addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      setGalleryCategory(button.dataset.category);
    });

  document.querySelectorAll("[data-channel-filter]").forEach((link) => {
    link.addEventListener("click", () => {
      setGalleryCategory(link.dataset.channelFilter);
    });
  });
}

function setGalleryCategory(category = "") {
  document.querySelectorAll("#galleryFilters button").forEach((item) => {
    item.classList.toggle("active", item.dataset.category === category);
  });
  renderGallery(category);
}

function setupThemeAndAudio() {
  const themeToggle = document.getElementById("themeToggle");
  themeToggle.textContent = document.body.classList.contains("light")
    ? "Dark mode"
    : "Light mode";
  themeToggle.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light");
    themeToggle.textContent = isLight ? "Dark mode" : "Light mode";
  });

  const audio = document.getElementById("backgroundAudio");
  const button = document.getElementById("audioToggle");
  button.addEventListener("click", async () => {
    if (audio.paused) {
      try {
        await audio.play();
        button.textContent = "Score On";
        button.setAttribute("aria-pressed", "true");
      } catch {
        button.textContent = "Add audio file";
      }
    } else {
      audio.pause();
      button.textContent = "Background Score";
      button.setAttribute("aria-pressed", "false");
    }
  });
}

function setupNavigation() {
  const menuToggle = document.getElementById("menuToggle");
  const pageOverlay = document.getElementById("pageOverlay");
  const links = document.querySelectorAll(".side-links a");

  function closeMenu() {
    document.body.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  pageOverlay.addEventListener("click", closeMenu);
  links.forEach((link) => link.addEventListener("click", closeMenu));

  const sections = Array.from(
    document.querySelectorAll("main section[id], main[id]"),
  );
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;

      const id = visible.target.id;
      document.querySelectorAll(".side-links a").forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    },
    { threshold: [0.28, 0.5, 0.72] },
  );

  sections.forEach((section) => observer.observe(section));
}

async function init() {
  const [servicesResult, locationsResult] = await Promise.all([
    API.getServices(),
    API.getLocations(),
  ]);
  state.services = servicesResult.data.services;
  state.addOns = servicesResult.data.addOns;
  state.locations = locationsResult.data;

  renderServices();
  renderLocations();
  setupSelectors();
  setupBookingForm();
  setupGalleryFilters();
  setupThemeAndAudio();
  setupNavigation();
  setupWhatsAppLinks();
  setupStills();
  await updateEstimate();
  await renderStills();
  await renderGallery();
  setupRevealAnimations();
}

init().catch((error) => {
  console.error(error);
  document.body.insertAdjacentHTML(
    "afterbegin",
    `
    <div style="position:fixed;left:16px;right:16px;top:16px;z-index:9999;padding:14px 16px;background:#ef5b5b;color:white;border-radius:8px;font-weight:800;box-shadow:0 16px 40px rgba(0,0,0,.22)">
      Website data could not load. Run <code>npm start</code> in this project, then open <code>http://localhost:5000</code>. If you use Live Server, keep the backend running on port 5000. Details: ${error.message}
    </div>
  `,
  );
});
