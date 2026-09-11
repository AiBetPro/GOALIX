# Goalix V0.9 — PostgreSQL + Prisma

Cette version remplace le stockage mémoire des paris par PostgreSQL + Prisma et utilise une transaction atomique pour :
1. vérifier le solde ;
2. vérifier la cote envoyée ;
3. créer le pari et ses sélections ;
4. débiter le solde ;
5. créer la transaction.

## Installation

1. Copier `.env.example` vers `.env`.
2. Renseigner `DATABASE_URL`.
3. `npm install`
4. `npx prisma generate`
5. `npx prisma migrate dev --name init`
6. `npx prisma db seed`
7. `npm run dev`

Le compte de démonstration a l'identifiant `demo-user`.

## Sécurité
La route utilise encore un utilisateur démo fixe : ce n'est PAS une authentification de production. Avant argent réel, ajouter une authentification robuste, sessions sécurisées, contrôle d'accès, journalisation/audit, limites, anti-fraude et conformité réglementaire.

Les paris et le solde restent fictifs.
