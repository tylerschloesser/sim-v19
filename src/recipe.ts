import invariant from 'tiny-invariant'
import { EntityType, entityTypeSchema } from './schema'

export function getRecipe(
  entityType: EntityType,
): Record<string, number> {
  switch (entityType) {
    case entityTypeSchema.enum.Furnace: {
      return { red: 5 }
    }
    case entityTypeSchema.enum.Storage: {
      return { green: 5 }
    }
    default: {
      invariant(false, 'TODO')
    }
  }
}
