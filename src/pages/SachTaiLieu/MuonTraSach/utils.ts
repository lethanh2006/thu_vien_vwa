type TParseStudentCardOptions = {
	requireNextLabel?: boolean;
};

export const getMaSinhVienFromCardText = (value?: string, options?: TParseStudentCardOptions) => {
	const rawValue = value?.trim() ?? '';
	const normalizedValue = rawValue.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	const studentCodeLabel = /M(?:a)?\s*SV\s*:/i;
	const nextLabel =
		/(?:H(?:o)?\s*v(?:a)?\s*t(?:e)?n|Ng(?:a)?y\s*sinh|Gi(?:o)?i\s*t(?:i)?nh|L(?:o)?p|H(?:e)?|Ng(?:a)?nh(?:\/CTDT)?|Kh(?:o)?a)\s*:/i;
	const cardTextPattern = new RegExp(`${studentCodeLabel.source}\\s*([A-Z0-9]+?)\\s*(?=${nextLabel.source})`, 'i');
	const maSinhVienFromCard = normalizedValue.match(cardTextPattern)?.[1];

	if (maSinhVienFromCard || options?.requireNextLabel) {
		return maSinhVienFromCard ?? rawValue;
	}

	const studentCodePattern = new RegExp(`${studentCodeLabel.source}\\s*([A-Z0-9]+)`, 'i');

	return normalizedValue.match(studentCodePattern)?.[1] ?? rawValue;
};
