/**
 * Hardcoded GMU Campus Locations
 * Used for the location dropdown in the Monitor screen
 */

import { CampusLocation } from '../types';

export const CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: 'fenwick',
    name: 'Fenwick Library',
    rooms: [
      '1st Floor Lobby',
      '2nd Floor Quiet Zone',
      '3rd Floor Study Cells',
      '4th Floor Group Area',
    ],
  },
  {
    id: 'jc',
    name: 'Johnson Center',
    rooms: [
      'Food Court',
      'Ground Floor Library',
      'Dewberry Hall Hallway',
    ],
  },
  {
    id: 'horizon',
    name: 'Horizon Hall',
    rooms: [
      'Atrium',
      '2nd Floor Labs',
      '3rd Floor Breakout',
    ],
  },
];

/**
 * Helper function to get all rooms for a building
 */
export function getRoomsForBuilding(buildingId: string): string[] {
  const building = CAMPUS_LOCATIONS.find(loc => loc.id === buildingId);
  return building ? building.rooms : [];
}

/**
 * Helper function to get building name by ID
 */
export function getBuildingName(buildingId: string): string {
  const building = CAMPUS_LOCATIONS.find(loc => loc.id === buildingId);
  return building ? building.name : '';
}
