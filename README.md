Un bot tournant sur NodeJS et permettant de jouer au pendu sur Discord. Ce bot est encore en création! Si vous avez des fonctionnalités que vous voulez dans le bot, vous pouvez ouvrir des Issues!

# Instalation
*Vous avez besoin de NodeJS et de discord.js.*

1. Installez [NodeJS ici](https://nodejs.org/en/download/)
2. Ouvrez un terminal de commande et installez Discord.js
```
npm install discord.js
```
3. Clonez le contenu de ce dépot et modifiez le fichier `config.json`
4. Allez créer une application sur [l'API de Discord](https://discordapp.com/developers/applications/) et créez un bot.
5. Collez le token dans `token` de `config.json`
6. Créez un channel pour le bot (attention il modifiera le titre et la description de celui ci) et collez son identifiant dans `channel`
7. Lancez le bot avec
```
node index.js
```
