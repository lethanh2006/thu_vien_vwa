declare module Z3950 {
	export interface IRecord {
		id: string;
		author: string;
		control_fields: object;
		data_fields: TDataFields[];
		data_type_received: string;
		isbn: string[];
		issn: string[];
		leader: string;
		publication_year: string;
		publisher: string;
		title: string;
		record_number: string;
		subjects: string[];
	}

	export type TDataFields = {
		indicators: string[];
		subfields: {
			code: string;
			value: string;
		}[];
		tag: string;
	};
	export interface IMayChu {
		database: string;
		description: string;
		host: string;
		name: string;
		port: number;
		syntax: string;
	}
}
