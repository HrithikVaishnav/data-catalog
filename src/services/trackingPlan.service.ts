import prisma from "../prismaClient";

export const upsertEventsAndProperties = async ({
  trackingPlanId,
  events,
}: {
  trackingPlanId: string;
  events: any[];
}) => {
  for (const event of events) {
    const {
      name: eventName,
      type,
      description: eventDesc,
      properties,
      additionalProperties,
    } = event;

    // 1. Upsert event
    let existingEvent = await prisma.event.findFirst({ where: { name: eventName, type } });

    if (existingEvent) {
      if (existingEvent.description !== eventDesc) {
        existingEvent = await prisma.event.update({
          where: { id: existingEvent.id },
          data: { description: eventDesc },
        });
      }
    } else {
      existingEvent = await prisma.event.create({
        data: { name: eventName, type, description: eventDesc },
      });
    }

    // 2. Find trackingPlanEvent link manually
    const existingLink = await prisma.trackingPlanEvent.findFirst({
      where: {
        trackingPlanId,
        eventId: existingEvent.id,
      },
    });

    if (existingLink) {
      await prisma.trackingPlanEvent.update({
        where: { id: existingLink.id },
        data: { additionalProperties },
      });
    } else {
      await prisma.trackingPlanEvent.create({
        data: {
          trackingPlanId,
          eventId: existingEvent.id,
          additionalProperties,
        },
      });
    }

    // 3. Process event properties
    for (const prop of properties) {
      const { name: propName, type: propType, description: propDesc, required } = prop;

      let existingProperty = await prisma.property.findFirst({ where: { name: propName, type: propType } });

      if (existingProperty) {
        if (existingProperty.description !== propDesc) {
          existingProperty = await prisma.property.update({
            where: { id: existingProperty.id },
            data: { description: propDesc },
          });
        }
      } else {
        existingProperty = await prisma.property.create({
          data: { name: propName, type: propType, description: propDesc },
        });
      }

      // 4. Find eventProperty link manually
      const existingEventProp = await prisma.eventProperty.findFirst({
        where: {
          eventId: existingEvent.id,
          propertyId: existingProperty.id,
        },
      });

      if (existingEventProp) {
        await prisma.eventProperty.update({
          where: { id: existingEventProp.id },
          data: { required },
        });
      } else {
        await prisma.eventProperty.create({
          data: {
            eventId: existingEvent.id,
            propertyId: existingProperty.id,
            required,
          },
        });
      }
    }
  }
};
