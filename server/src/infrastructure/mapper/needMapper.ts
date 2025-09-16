import { Need as DomainNeed } from '../../domain/entities/need';

import { INeedDocument } from '../configs/models/moongoseNeedModel';

export class NeedMapper {
  static toDomain(needDoc: INeedDocument): DomainNeed {
    return new DomainNeed(
      {
        title: needDoc.title,
        description: needDoc.description,
        type: needDoc.type,
        submitterType: needDoc.submitterType,
        submitterContact: needDoc.submitterContact,
        location: needDoc.location,
        status: needDoc.status,
        createdAt: needDoc.createdAt,
        updatedAt: needDoc.updatedAt,
      },
      needDoc._id.toString(),
    );
  }
}
