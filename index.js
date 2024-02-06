const BASE_URL = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2401-FSA-ET-WEB-FT-SF";
const ENDPOINT = "/events";

const state = {
  parties: [],
  selectedParty: null,
};

const addPartyForm = document.querySelector("#addParty");

function setSelectedParty(party) {
  state.selectedParty = party;
  location.hash = party.id;
}

function loadPartyFromHash() {
  const id = +location.hash.slice(1);
  state.selectedParty = state.parties.find((recipe) => recipe.id === id);
}

async function getParties() {
  try {
    const response = await fetch(BASE_URL + COHORT + ENDPOINT);
    const parsedResponse = await response.json();
    state.parties = parsedResponse.data;
  } catch (err) {
    console.error(err);
  }
}

function renderParties() {
  if (!state.parties.length) {
    console.log("no parties");
  } else {
    const $ul = document.querySelector("#parties");

    const $parties = state.parties.map((party) => {
      const $li = document.createElement("li");
      $li.innerHTML = `
          <h2>${party.name}</h2>
        `;
      $li.addEventListener("click", (_event) => {
        setSelectedParty(party);
        renderSelectedParty();
      });

      return $li;
    });

    $ul.replaceChildren(...$parties);
  }
}

function renderSelectedParty() {
  if (state.selectedParty) {
    const $party = document.querySelector("article.selected_party");
    $party.innerHTML = `
          <p>${state.selectedParty.description}</p>
          <p>${state.selectedParty.date}</p>
          <p>${state.selectedParty.location}</p>
          <button>Delete</delete>    
        `;
    const $button = $party.querySelector("button");
    $button.addEventListener("click", () =>
      deleteParty(state.selectedParty.id)
    );
  } else {
    document.querySelector("article.selected_party").innerHTML = "";
    console.log("Select a Party");
  }
}

async function addParty(event) {
  event.preventDefault();
  const date = new Date(addPartyForm.date.value).toISOString();
  try {
    const response = await fetch(BASE_URL + COHORT + ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addPartyForm.name.value,
        description: addPartyForm.description.value,
        date,
        location: addPartyForm.location.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add artist");
    }
    addPartyForm.name.value = "";
    addPartyForm.description.value = "";
    addPartyForm.date.value = "";
    addPartyForm.location.value = "";
    init();
  } catch (err) {
    console.error(err);
  }
}

async function deleteParty(id) {
  try {
    const response = await fetch(BASE_URL + COHORT + ENDPOINT + "/" + id, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete party");
    }
    state.selectedParty.value = null;
    init();
  } catch (err) {
    console.error(err);
  }
}

async function init() {
  await getParties();
  renderParties();

  loadPartyFromHash();
  renderSelectedParty();
}

addPartyForm.addEventListener("submit", addParty);

init();
