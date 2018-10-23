const fs = require("fs")
const Discord = require("discord.js");
const client = new Discord.Client();
const mots = require("./mots.json")
const config = require("./config.json")

var date = new Date().toLocaleTimeString();
var version = "0.4.0";

var motATrouver = "";
var motTrouve = "";
var inGame = false;
var erreur = 0;
var nbEssais = 0;
var difficultee = "";

client.login(config.token);

client.on("ready", async () => {
  addLog("Connection du bot à Discord.", true)
  client.user.setGame(config.prefix + "help");
});

function addLog(pMessage, pRetour) {
  /*
  addLog : procedure :
    Ajoute le message pMessage dans le fichier log definit dans config.json

  Parametre:
    pMessage : str : le message a ajouter aux logs
    pRetour : bool : si un retour a la ligne avant le lot ou pas
  */

  var date = new Date().toLocaleTimeString();

  if (pRetour === false) {
    fs.appendFile(config.log, "\n[" + date + "] " + pMessage, function (err) {});
  } else {
    fs.appendFile(config.log, "\n\n[" + date + "] " + pMessage, function (err) {});
  }
}

function genChaineCherche(pChaine, pMode) {
  /*
  genChaineCherche : fonction : str :
      Retourne la chaine contenant les - et la premiere/derniere lettre (au choix)

  Peremetre:
    pChaine : str : la chaine d'entree
    pMode : str : le mode de difficultee (NORMAL HARD)

  Retour:
    chaineSortie : str : chaine renvoyee, contenant des _
  */

  var chaineSortie = "";

  if (pMode === "NORMAL") {
    chaineSortie = chaineSortie + pChaine.charAt(0);
    for (var i = 0; i < pChaine.length-2; i++) {
      chaineSortie = chaineSortie + "-";
    }
    chaineSortie = chaineSortie + pChaine.charAt(pChaine.length-1);
    difficultee = "NORMAL";
  } else {
    for (var i = 0; i < pChaine.length; i++) {
      chaineSortie = chaineSortie + "-";
    }
    difficultee = "HARD"
  }

  return chaineSortie;
}

function modifyMotTrouve(pMotTrouve, pMot, pChar) {
  /*
  modifyMotTrouve : fonction : str :
    Remplace les - dans le motTrouve par la lettre entree

  Parametres:
    pMotTrouve : str : chaine de caractere contenant les lettres deja trouvees
      dans le mot
    pMot : str : le mot entree par l'utilisateur
    pChar : char : le caractere entree par l'utilisateur

  Retour:
    chaineSortie : str : la chaine de sortie
  */

  var chaineSortie = "";

  for (var i = 0; i < pMot.length; i++) {
    if (pChar == pMot.charAt(i)) {
      chaineSortie = chaineSortie + pChar;
    } else {
      chaineSortie = chaineSortie + pMotTrouve.charAt(i);
    }
  }

  return chaineSortie
}

function affPendu(pErreur) {
  /*
  affPendu : procedure :
    Affichage du pendu à differents stades en fonction de pErreur

  Parametre:
    pErreur : int : le nombre d'erreur de l'utilisateur

  Retour:
    chaineSortie : str : la chaine de sortie
  */

  if (pErreur === 0) {
    var chaineSortie = "``` ┏━━━━━┯\n ┃     │\n ┃\n ┃\n ┃\n━┻━```";
  } else if (pErreur === 1) {
    var chaineSortie = "``` ┏━━━━━┯\n ┃     │\n ┃     O\n ┃\n ┃\n━┻━```";
  } else if (pErreur === 2) {
    var chaineSortie = "``` ┏━━━━━┯\n ┃     │\n ┃     O\n ┃     X\n ┃\n━┻━```";
  } else if (pErreur === 3) {
    var chaineSortie = "``` ┏━━━━━┯\n ┃     │\n ┃    \\O\n ┃     X\n ┃\n━┻━```";
  } else if (pErreur === 4) {
    var chaineSortie = "``` ┏━━━━━┯\n ┃     │\n ┃    \\O/\n ┃     X\n ┃\n━┻━```";
  } else if (pErreur === 5) {
    var chaineSortie = "``` ┏━━━━━┯\n ┃     │\n ┃    \\O/\n ┃     X\n ┃    /\n━┻━```";
  } else if (pErreur === 6) {
    var chaineSortie = "``` ┏━━━━━┯\n ┃     │\n ┃    \\O/\n ┃     X\n ┃    / \\\n━┻━```";
  }

return chaineSortie;
}

function randint(pMax) {
  /*
  randint : fonction : int :
    Renvoit un entier aléatoire entre 0 et pMax

  Parametre:
    pMax : int : la borne superieur de l'aléatoire
  */
  return Math.floor(Math.random() * Math.floor(pMax));
}

function choixMotRandom() {
  /*
  choixMotRandom : fonction :
    Choisis un mot au hazard dans le fichier mots.json
  
  Local:
    rndValue : int : une valeur aléatoire choisis entre 0 et la taille du tableau
  
  Retour:
    motChoisis : str : le mot choisis aléatoirement
  */

  var rndValue = randint(mots.liste_mot.length);
  return mots.liste_mot[rndValue];
}

function occurence(pMot, pChar) {
  /*
  occurence : fonction : bool :
    Renvoit True si le caractere pChar est dans la chaine pMot, False sinon

  Parametre:
    pMot : str : le mot a tester
    pChar : char : le caractere a tester

  Local:
    i : int : boucle de repetition

  Retour:
    dedans : bool : True si le caractere et dedans False sinon
  */

  var i = 0;
  var dedans = false;

  while (i < pMot.length && dedans === false) {
    if (pMot.charAt(i) === pChar) {
      dedans = true;
    }

    i = i + 1;
  }

  return dedans;
}

function isCommand(pCommande, pMessage) {
  /*
  isCommand : fonction : bool :
    Fonction qui test si un message est une commande ou non

  Parametres:
    pCommande : str : la commande a tester
    pMessage : objet : le message envoyé par l'utilisateur
  */
  return pMessage.content.startsWith(config.prefix+ pCommande)
}

client.on("message", message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    if(message.content.startsWith(config.prefix)===true) {
      args = message.content.split(/[ ]+/)
    } else {
      return;
    }
    if(message.channel.id!=config.channel) return;

    if (isCommand("start", message)) {
      if (inGame === false) {
        message.delete()
        message.channel.edit({"name": "❌pendu", "topic" : "Partie en cours. Lancée par " + message.author.username})
        if (args[2] != null) {
          motATrouver = args[2].toUpperCase();
        } else {
          motATrouver = choixMotRandom();
        }

        if (args[1] == null) {
          motTrouve = genChaineCherche(motATrouver, "NORMAL");
        } else if (args[1].toUpperCase()!="NORMAL" && args[1].toUpperCase()!= "HARD") {
          motTrouve = genChaineCherche(motATrouver, "NORMAL");
        } else {
          motTrouve = genChaineCherche(motATrouver, args[1].toUpperCase());
        }
        inGame = true;
        erreur = 0;

        addLog("Démarage d'une partie par " + message.author.username + " | Mot a trouver : " + motATrouver + " | Difficultée : " + difficultee, false);
        const embed = {
          "title": "Nouvelle partie (" + difficultee + ")",
          "description": "Utilisez `" + config.prefix + "try` pour proposer des lettres ou des mots!\n\n**> " + motTrouve + " <**",
          "color": 2719929
        };
        message.channel.send({ embed });
      } else {
        message.reply("La partie est déjà en cours!");
      }
    }

    if (isCommand("try", message)) {
      if (inGame === true) {
        if (args[1] != null) {
          nbEssais = nbEssais + 1;
          if (args[1].length === 1) {
            if (occurence(motATrouver, args[1].toUpperCase()) === false) {
              erreur = erreur + 1;

              if (erreur === 7) {
                var win = false;
                inGame = false;
              }
            } else {
              motTrouve = modifyMotTrouve(motTrouve, motATrouver, args[1].toUpperCase())
            }



            if (motTrouve === motATrouver) {
              var win = true;
              inGame = false;
            }

            if (inGame === false) {
              if (win === true) {
                message.channel.edit({"name": "✔️pendu", "topic" : "Channel disponible! Utilisiez `" + config.prefix + "start (difficultee) (mot)` pour lancer!"})
                const embed = {
                  "title": "Victoire!",
                  "description": affPendu(erreur) + "Vous avez trouvé le mot `" + motATrouver + "` avec **" + erreur + "** erreurs et **" + nbEssais + "** essais!",
                  "color": 5025616
                };
                message.channel.send({ embed });
              } else {
                const embed = {
                  "title": "Défaite!",
                  "description": affPendu(6) + "Vous avez perdu! Le mot a trouver était `" + motATrouver + "`",
                  "color": 15158332
                };
                message.channel.send({ embed });
                message.channel.edit({"name": "✔️pendu", "topic" : "Channel disponible! Utilisiez `" + config.prefix + "start (difficultee) (mot)` pour lancer!"})
              }
              addLog("Partie terminée par " + message.author.username, false)
            } else {
              const embed = {
                "title": "> " + motTrouve + " <",
                "description": affPendu(erreur),
                "color": 2719929,
                "fields": [
                  {
                    "name": "Erreurs",
                    "value": erreur + "/6",
                    "inline": true
                  },
                  {
                    "name": "Essais",
                    "value": nbEssais,
                    "inline": true
                  }
                ]
              };
              message.channel.send({ embed });
            }
          } else {
            if (args[1].toUpperCase() === motATrouver) {
              const embed = {
                "title": "Victoire!",
                "description": affPendu(erreur) + "Vous avez trouvé le mot `" + motATrouver + "` avec **" + erreur + "** erreurs et **" + nbEssais + "** essais!!",
                "color": 5025616
              };
              message.channel.send({ embed });
              message.channel.edit({"name": "✔️pendu", "topic" : "Channel disponible! Utilisiez `" + config.prefix + "start (difficultee) (mot)` pour lancer!"})
              addLog("Partie terminée par " + message.author.username, false)
              win = false;
              inGame = false;
            } else {
              erreur = erreur + 1;

              if (erreur === 7) {
                var win = false;
                inGame = false;
                const embed = {
                  "title": "Défaite!",
                  "description": affPendu(6) + "Vous avez perdu! Le mot a trouver était `" + motATrouver + "`",
                  "color": 15158332
                };
                message.channel.send({ embed });
                message.channel.edit({"name": "✔️pendu", "topic" : "Channel disponible! Utilisiez `" + config.prefix + "start (difficultee) (mot)` pour lancer!"})
                addLog("Partie terminée par " + message.author.username, false)
              } else {
                const embed = {
                  "title": "> " + motTrouve + " <",
                  "description": affPendu(erreur),
                  "color": 2719929,
                  "fields": [
                    {
                      "name": "Erreurs",
                      "value": erreur + "/6",
                      "inline": true
                    },
                    {
                      "name": "Essais",
                      "value": nbEssais,
                      "inline": true
                    }
                  ]
                };
                message.channel.send({ embed });
              }
            }
          }
        } else {
          message.channel.send("Vous devez spécifier un argument après `" + config.prefix + "try (lettre/mot)`!")
        }
      } else {
        message.reply("La partie n'est pas encore lancée! Utilisez `" + config.prefix + "start (difficultee) (mot)`");
      }
    }

    if (isCommand("close", message)) {
      message.delete()
      if (message.member.hasPermission('ADMINISTRATOR')) {
        inGame = false;
        win = false;
        message.channel.edit({"name": "✔️pendu", "topic" : "Channel disponible! Utilisiez " + config.prefix + "start (difficultee) (mot) pour lancer!"})
        message.reply("La partie a bien été annulée.")
        addLog("Arrêt de la partie par un Administrateur", false)
      }
    }

    if (isCommand("help", message)) {
      message.delete()
      message.author.send("Bienvenue dans l'aide du Pendu Bot version **" + version + "**.\n\n__**Commandes :**__\n:black_small_square: `" + config.prefix + "start (difficultee) (mot)` : Démare une partie avec le mot (mot) ou un mot aléatoire si non spécifié\n:black_small_square: `" + config.prefix + "try [lettre/mot]` : Essaye de trouver la lettre [lettre] ou le mot [mot]\n:black_small_square: `" + config.prefix + "help` : Affiche ce message")
    }
});