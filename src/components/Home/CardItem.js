import React from "react";
import { Card, CardBody } from "@nextui-org/react";

const CardItem = ({ cardsData }) => {

  return (
    <div className="grid grid-cols-12 gap-4">
      {cardsData.map((card, index) => (
        <Card
          key={index}
          className={`${card.card_bg} rounded-small card-box-shadow col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3`}
        >
          <CardBody className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="flex items-center text-xl text-neutral-100 truncate font-semibold mb-1.5">
                  {card.counter}
                </h4>

                <p className="text-xs text-neutral-100 mb-2 truncate">
                  {card.title}
                </p>

              </div>

              <div>
                <card.icon
                  height={44}
                  width={44}
                  color='white'
                  strokeWidth={2}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      ))
      }
    </div >
  );
};

export default CardItem;
