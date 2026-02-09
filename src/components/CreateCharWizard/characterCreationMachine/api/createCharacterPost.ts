import { crappyNetworkClient } from "@/crappyApiClient/crappyNetworkClient";

export const createCharacterPost = () => {
  // This would typically be a fetch or axios GET or POST to an api
  // It's written here as a basic ts function so that it can be pulled into the actor section of the machine

  // This API dir here is a home for all the different calls that will supply data or directional
  // control to your machine

  return crappyNetworkClient.createCharacter();
};
