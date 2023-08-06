import fetch from "node-fetch";
// фунция которая преобразует адрес в локацию этого адреса

const MakeRequestURL = (address: string): string => {
    let resultURL = "https://api.geoapify.com/v1/geocode/search?text=";
    const addressLength = address.length;
    for(let i = 0; i < addressLength; i++ ){
        if(address[i] != ' '){
            resultURL = resultURL + address[i];
        } else {
            resultURL = resultURL + "%20";
        }
    }
    resultURL +="&apiKey=2481c54dc9de4bd999aed241c464c094";
    return resultURL;
}


export const TransformAddressToLocation = async (address: string):Promise<Array<number>|void> =>{ //
    const requestURL = MakeRequestURL(address);
    return await getGeoCode(requestURL);
}

const getGeoCode = async(url: string): Promise<Array<number>|void> => {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }

        const result = (await response.json());
        console.log(result);
        // @ts-ignore
        return result.features[0].geometry.coordinates;

    } catch (error) {
        if (error instanceof Error) {
            console.log('error message: ', error.message);
        } else {
            console.log('unexpected error: ', error);
        }
    }

}

//TransformAddressToLocation("254 Антона Петрова улица Барнаул Российская Федерация");