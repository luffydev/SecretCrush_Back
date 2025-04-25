const {DATABASE_CONFIG} = require('./../config/config');
const SequelizeAuto = require('sequelize-auto');

const fs = require('fs');
const path = require('path');

// Fonction récursive pour vider un dossier
const clearDirectory = async (dirPath) => {
  try {
    // Lire le contenu du dossier
    const files = await fs.promises.readdir(dirPath);

    // Supprimer chaque fichier ou sous-dossier
    for (const file of files) {
      const filePath = path.join(dirPath, file);

      // Vérifier si c'est un dossier ou un fichier
      const stat = await fs.promises.stat(filePath);

      if (stat.isDirectory()) {
        // Si c'est un dossier, on appelle la fonction récursive
        await clearDirectory(filePath);
        // Après avoir vidé le dossier, on peut le supprimer
        await fs.promises.rmdir(filePath);
      } else {
        // Si c'est un fichier, on le supprime
        await fs.promises.unlink(filePath);
      }
    }

    console.log(`[ORM] -> Le dossier ${dirPath} a été vidé.`);
  } catch (error) {
    console.error(`[ORM] -> Erreur lors de la suppression du contenu du dossier :`, error);
  }
};


const auto = new SequelizeAuto(DATABASE_CONFIG.database, DATABASE_CONFIG.user, DATABASE_CONFIG.password, {
    host: DATABASE_CONFIG.host,
    dialect: 'postgres',
    logging: false,
    directory: './models',
    port: DATABASE_CONFIG.port,
    additional: {
        timestamps: true, // Ou true si tu veux que Sequelize gère automatiquement createdAt et updatedAt
        paranoid: true    // Si tu veux activer le "soft delete" (deletedAt)
    }
});

clearDirectory('./models/');

auto.run()
  .then(() => {
    console.log('[ORM] -> Modèles générés avec succès!');
  })
  .catch((err) => {
    console.error('[ORM] -> Erreur lors de l\'exécution de auto.run:', err);
  });