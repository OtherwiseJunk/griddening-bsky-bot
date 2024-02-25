
import puppeteer from 'puppeteer';
import fs from 'fs';

const url = "https://magicthegridden.ing";
const screenshotPath = "./dailyPuzzle.png";
const gameStateUrl = 'https://magicthegridden.ing/api/gameState/screenshotPoster';
export enum ConstraintType {
  Rarity,
  Type,
  ManaValue,
  Color,
  Set,
  Power,
  Toughness,
  Artist,
  CreatureRulesText,
  CreatureRaceTypes,
  CreatureJobTypes,
  ArtifactSubtypes,
  EnchantmentSubtypes,
  __LENGTH
}

export async function getDailyPuzzleScreenshot(): Promise<Uint8Array> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.setViewport({ width: 750, height: 750 });
  await setTimeout(async () =>{
    await page.screenshot({ path: screenshotPath });
    await browser.close();

  }, 2000);

  return fs.readFileSync(screenshotPath);
}

export async function getDailyPuzzleAltText(): Promise<string> {
  let response = await fetch(gameStateUrl);
  let data = await response.json();
  return generateAltTextFromGameState(data);
}

export function generateAltTextFromGameState(game): string{
  const topRowDescOne = getDescriptionForConstraint(game.gameConstraints[0]);
  const topRowDescTwo = getDescriptionForConstraint(game.gameConstraints[1]);
  const topRowDescThree = getDescriptionForConstraint(game.gameConstraints[2]);
  const sideRowDescOne = getDescriptionForConstraint(game.gameConstraints[3]);
  const sideRowDescTwo = getDescriptionForConstraint(game.gameConstraints[4]);
  const sideRowDescThree = getDescriptionForConstraint(game.gameConstraints[5]);

  return `A Magic The Griddening Puzzle.
The puzzle is a 3x3 grid of inputs, with the following constraints:
Top row: ${topRowDescOne}, ${topRowDescTwo}, ${topRowDescThree}
Side row: ${sideRowDescOne}, ${sideRowDescTwo}, ${sideRowDescThree}
The board is blank.`
}

export function getDescriptionForConstraint(constraint){
  switch(constraint.constraintType){
    case ConstraintType.ManaValue:
      return `${constraint.displayName}`;
    case ConstraintType.Artist:
      return `${constraint.displayName}`;
    case ConstraintType.Power:
      return `${constraint.displayName}`;
    case ConstraintType.Toughness:
      return `${constraint.displayName}`;
    case ConstraintType.CreatureRulesText:
      return `${constraint.displayName} (Rules Text)`;
    case ConstraintType.CreatureRaceTypes:
      return `${constraint.displayName} (Creature Type)`;
    case ConstraintType.CreatureJobTypes:
      return `${constraint.displayName} (Creature Type)`;
    case ConstraintType.ArtifactSubtypes:
      return `${constraint.displayName} (Artifact Type)`;
    case ConstraintType.EnchantmentSubtypes:
      return `${constraint.displayName} (Enchantment Type)`;
    default:
      return `${constraint.displayName} (${ConstraintType[constraint.constraintType]})`;
  }
}

export function getPostText() {
  return `https://magicthegridden.ing

#MagicTheGathering
#MagicTheGriddening`;
}