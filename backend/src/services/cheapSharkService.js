import axios from "axios";

const CHEAPSHARK_BASE_URL = "https://www.cheapshark.com/api/1.0";

// lojas permitidas
const ALLOWED_STORES = {
  "1": "Steam",
  "25": "Epic Games Store",
  "7": "GOG",
  "11": "Humble Store"
};

// normaliza texto (remove símbolos, espaços, etc)
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

// calcula similaridade simples entre strings
function similarity(a, b) {
  let longer = a.length > b.length ? a : b;
  let shorter = a.length > b.length ? b : a;

  let sameChars = 0;
  for (let char of shorter) {
    if (longer.includes(char)) sameChars++;
  }

  return sameChars / longer.length;
}

/**
 * Busca a melhor promoção REAL de um jogo
 */
export async function getBestDealByTitle(title) {
  /* =========================
    BUSCAR JOGOS PELO TÍTULO
  ========================== */
  const gamesResponse = await axios.get(
    `${CHEAPSHARK_BASE_URL}/games`,
    { params: { title } }
  );

  const games = gamesResponse.data;

  if (!games || games.length === 0) {
    return null;
  }

  const normalizedSearch = normalize(title);

  /* =========================
    ESCOLHER O JOGO CORRETO
  ========================== */
  const matchedGameData = games
    .map(game => ({
      game,
      score: similarity(normalize(game.external), normalizedSearch)
    }))
    .sort((a, b) => b.score - a.score)[0];

  // limiar mínimo de similaridade
  if (!matchedGameData || matchedGameData.score < 0.6) {
    return null;
  }

  const selectedGame = matchedGameData.game;

  /* =========================
    BUSCAR DEALS DESSE JOGO
  ========================== */
  const dealsResponse = await axios.get(
    `${CHEAPSHARK_BASE_URL}/games`,
    { params: { id: selectedGame.gameID } }
  );

  const deals = dealsResponse.data?.deals;

  if (!deals || deals.length === 0) {
    return null;
  }

  /* =========================
     FILTRAR DEALS VÁLIDOS
  ========================== */
  const validDeals = deals.filter(deal =>
    deal.isOnSale === "1" &&
    ALLOWED_STORES[deal.storeID]
  );

  if (validDeals.length === 0) {
    return null;
  }

  // ordenar pelo MAIOR desconto
  validDeals.sort((a, b) => Number(b.savings) - Number(a.savings));

  const bestDeal = validDeals[0];

  /* =========================
    LINK CORRETO DA LOJA
  ========================== */
  let storeLink = `https://www.cheapshark.com/redirect?dealID=${bestDeal.dealID}`;

  // se for Steam, usa link direto da Steam
  if (bestDeal.storeID === "1" && selectedGame.steamAppID) {
    storeLink = `https://store.steampowered.com/app/${selectedGame.steamAppID}`;
  }

  return {
    gameTitle: selectedGame.external,
    salePrice: Number(bestDeal.salePrice),
    normalPrice: Number(bestDeal.normalPrice),
    savings: Number(bestDeal.savings),
    store: ALLOWED_STORES[bestDeal.storeID],
    dealID: bestDeal.dealID,
    steamAppID: selectedGame.steamAppID,
    redirectUrl: storeLink
  };
}
