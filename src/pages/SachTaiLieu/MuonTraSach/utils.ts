type TParseStudentCardOptions = {
	requireNextLabel?: boolean;
};

export const getMaSinhVienFromCardText = (value?: string, options?: TParseStudentCardOptions) => {
	const rawValue = value?.trim() ?? '';
	const normalizedValue = rawValue.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	const pattern = options?.requireNextLabel
		? /Ma\s*SV\s*:\s*([A-Z0-9]+)\s+(?=Ho\s+va\s+ten|Ngay\s+sinh|Gioi\s+tinh|Lop|He|Nganh|Khoa)/i
		: /Ma\s*SV\s*:\s*([A-Z0-9]+)/i;
	const maSinhVien = normalizedValue.match(pattern)?.[1];

	return maSinhVien ?? rawValue;
};
