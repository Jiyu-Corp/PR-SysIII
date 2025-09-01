import { useEffect, useState } from "react";

import "./FinishParkingServiceTab.css"
import { ArrowRightIcon, ArrowUpRightIcon, XIcon } from "@phosphor-icons/react";
import InputModal from "../InputModal/InputModal";
import ButtonModal from "../ButtonModal/ButtonModal";
import { Grid } from "react-loader-spinner";
import { requestPRSYS } from "@renderer/utils/http";
import { parkingServiceType } from "@renderer/types/resources/parkingServiceType";

type FinishParkingServiceTabProps = { 
  parkingService: parkingServiceType;
  closeTab: () => void;
};

export default function FinishParkingServiceTab({ parkingService }: FinishParkingServiceTabProps) {
  // Control Params
  const [isLoading, setIsLoading] = useState(false);

  // Inputs
  const [additionalDiscount, setAdditionalDiscount] = useState<string>("");

  // Data
  const [prices, setPrices] = useState<{
    description: string,
    value: number
  }[]>([]);
  const [priceTotal, setPriceTotal] = useState<number | undefined>(undefined)

  // Data Fetch
  useEffect(() => {
    setIsLoading(true);

    const fetches: Promise<void>[] = [
      fetchPrices()
    ];

    Promise.all(fetches).then(() => setIsLoading(false));
  }, []);

  async function fetchPrices() {
    try {
      const pricesResponse = await requestPRSYS('parking-service', `getServiceValues/${parkingService.idParkingService}`, 'GET');

      const pricesFormatted = pricesResponse.map(p => ({
        description: p.description,
        value: p.value
      } as {
        description: string,
        value: number
      })) as {
        description: string,
        value: number
      }[];

      setPrices(pricesFormatted);
      setPriceTotal(pricesFormatted.reduce((acc, cur) => acc + cur.value, 0));

    } catch(err) {
      console.error("Erro ao consultar preços do serviço.")
    }
  }
  
  // Behaviour
  const formatAdditionalPrice = (newValue: string) => {
    let formattedValue = newValue
      .replace(/[^0-9.,]/g, "")
      .replace(/(?<!\d)[.,]/g, "")
      .replace(/([.,]).*[.,]/g, "$1");
    
    const isCommaSeparator = formattedValue.indexOf(",") !== -1;
    const positionOfSeparator = isCommaSeparator
      ? formattedValue.indexOf(",")
      : formattedValue.indexOf(".");
    if(positionOfSeparator !== -1)
      formattedValue = formattedValue.slice(0, (positionOfSeparator + 3));

    const numericValue = parseFloat(formattedValue.replace(/,/g, "."));
    
    return formattedValue == "" || numericValue<=100
      ? formattedValue
      : positionOfSeparator !== -1
        ? formattedValue.slice(0, positionOfSeparator-1) + formattedValue.slice(positionOfSeparator)
        : formattedValue.slice(0, -1);
  }
  function updatePrices(newValue: string) {
    const additionalDiscountLabel = "Desconto Adicional"
    let newPrices = [... prices];
    const currentAdditionalDiscount = newPrices.find(np => np.description.includes(additionalDiscountLabel));
    if(typeof currentAdditionalDiscount !== 'undefined') 
      newPrices = newPrices.filter(p => p !== currentAdditionalDiscount);

    const newAdditionalDiscount: {
      description: string,
      value: number
    } = {
      description: additionalDiscountLabel,
      value: parseFloat(newValue.replace(/,/g, "."))
    }
    newPrices.push(newAdditionalDiscount);

    setPrices(newPrices);
    setPriceTotal(newPrices.reduce((acc, cur) => acc + cur.value, 0));
  }
  
  // Actions
  function handleFinishParkingService() {

  }

  return <div className="finish-parking-tab">
    <div className="finish-parking-header">
      <div className="fp-title">
        <h1>Saída</h1>
        <div className="fp-close"><XIcon/></div>
      </div>
      <div className="fp-header-content">
        <p>Horario de Entrada: {parkingService.dateRegister}</p>
        <div className="additional-discount-wrapper">
          <p>Desconto Adicional</p>
          <InputModal value={additionalDiscount} setValue={setAdditionalDiscount} formatInput={formatAdditionalPrice} onChange={updatePrices} placeholder="0,00"/>
        </div>
      </div>
    </div>
    {isLoading
      ? <div style={{ margin: "24px 64px" }}>
        <Grid
          visible={true}
          height="80"
          width="80"
          color="#4A87E8"
          ariaLabel="grid-loading"
          radius="12.5"
          wrapperStyle={{justifyContent: "center"}}
          wrapperClass="grid-wrapper"
        />
      </div>
      : <div className="finish-parking-body">
        <div className="fp-prices-wrapper">
          {prices.map(p => <div className="fp-price-wrapper" key={p.description}>
            <span style={{width: "50%"}}>{p.description}</span>
            <div style={{display: "flex", alignItems: "center", justifyContent: "center", width: "25%"}}>
              <ArrowRightIcon size={12}/>
            </div>
            <span style={{width: "25%"}}>R${Math.abs(p.value).toString()}</span>
          </div>
          )}
        </div>
        <div className="fp-price-total-wrapper">
          <span>R${priceTotal!.toString()}</span>
        </div>
      </div>
    }
    <div className="finish-parking-footer">
      <ButtonModal icon={ArrowUpRightIcon} text="Finalizar" action={handleFinishParkingService} color="#FFFFFF" backgroundColor="#3BB373" fontSize={12}/>
    </div>
  </div>
}