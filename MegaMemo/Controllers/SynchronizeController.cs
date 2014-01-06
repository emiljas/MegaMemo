﻿using MegaMemo.Models;
using MegaMemo.Models.Context;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebMatrix.WebData;

namespace MegaMemo.Controllers
{
    public class SynchronizeController : Controller
    {
        private MegaMemoDbContext _db = new MegaMemoDbContext();

        [HttpPost]
        public JsonResult SynchronizeDecks(FormCollection formCollection)
        {
            string decksJson = formCollection["json"];
            var decks = JsonConvert.DeserializeObject<List<Deck>>(decksJson);

            try
            {
                foreach (var deck in decks)
                {
                    var deckToSync = _db.Decks.FirstOrDefault(d =>
                        d.UserId == WebSecurity.CurrentUserId
                        && d.ClientId == deck.ClientId);

                    if (deckToSync == null)
                    {
                        deck.UserId = WebSecurity.CurrentUserId;
                        _db.Decks.Add(deck);
                    }
                    else
                    {
                        deckToSync.UserId = WebSecurity.CurrentUserId;
                        deckToSync.Title = deck.Title;
                    }
                }

                _db.SaveChanges();
            }
            catch (Exception ex)
            {
                return Json(new { success = false });
            }

            return Json(new { success = true });
        }

        [HttpPost]
        public JsonResult SynchronizeCards(FormCollection formCollection)
        {
            string cardsJson = formCollection["json"];
            var cards = JsonConvert.DeserializeObject<List<Card>>(cardsJson);

            try
            {
                foreach (var card in cards)
                {
                    var cardToSync = _db.Cards.FirstOrDefault(c =>
                        c.UserId == WebSecurity.CurrentUserId
                        && c.ClientId == card.ClientId);

                    if (cardToSync == null)
                    {
                        card.UserId = WebSecurity.CurrentUserId;
                        _db.Cards.Add(card);
                    }
                    else
                    {
                        cardToSync.Front = card.Front;
                        cardToSync.Back = card.Back;
                        cardToSync.RepetitionCount = card.RepetitionCount;
                        cardToSync.EasinessFactor = card.EasinessFactor;
                        cardToSync.NextRepetitionDate = card.NextRepetitionDate;
                        cardToSync.DaysToNextRepetition = card.DaysToNextRepetition;
                    }
                }

                _db.SaveChanges();
            }
            catch
            {
                return Json(new { success = false });
            }

            return Json(new { success = true });
        }

    }
}
