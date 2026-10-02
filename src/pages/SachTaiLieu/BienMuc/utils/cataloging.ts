export type CatalogSubfield = {
	code?: string;
	value?: string | number | null;
	ten?: string;
	kieuDuLieu?: string;
	_id?: string;
};

export type CatalogRow = {
	_id?: string | null;
	anPhamId?: string;
	tagCode?: string;
	ten?: string;
	ind1?: string;
	ind2?: string;
	value?: string | number | null;
	thuocTinhAnPham?: CatalogSubfield[];
	tag?: {
		noiDung?: string;
		thuocTinh?: { code?: string; tieuDe?: string }[];
	};
};

export type CatalogTemplateTag = {
	tag: string;
	ten?: string;
	thuocTinhDuLieu?: { code?: string; ten?: string; kieuDuLieu?: string }[];
};

const requiredTemplateFields: CatalogTemplateTag[] = [
	{
		tag: '245',
		ten: 'Nhan đề',
		thuocTinhDuLieu: [
			{ code: '$a', ten: 'Nhan đề chính' },
			{ code: '$b', ten: 'Nhan đề song song / phụ đề' },
		],
	},
	{
		tag: '700',
		ten: 'Tác giả bổ sung',
		thuocTinhDuLieu: [
			{ code: '$a', ten: 'Tên tác giả' },
			{ code: '$e', ten: 'Vai trò của tác giả (hiệu đính, dịch giả)' },
		],
	},
	{
		tag: '650',
		ten: 'Chủ đề',
		thuocTinhDuLieu: [
			{ code: '$a', ten: 'Chủ đề chính' },
			{ code: '$z', ten: 'Chia nhỏ theo địa lý' },
			{ code: '$y', ten: 'Chia nhỏ theo niên đại' },
		],
	},
];

/** Add required fields to the current form without changing the stored template. */
export const completeCatalogTemplate = (template: CatalogTemplateTag[] = []): CatalogTemplateTag[] => {
	const result = template.map((item) => ({
		...item,
		thuocTinhDuLieu: item.thuocTinhDuLieu?.map((subfield) => ({ ...subfield })),
	}));
	for (const required of requiredTemplateFields) {
		const existing = result.find((item) => item.tag === required.tag);
		if (!existing) {
			result.push({ ...required, thuocTinhDuLieu: required.thuocTinhDuLieu?.map((item) => ({ ...item })) });
			continue;
		}
		const fields = existing.thuocTinhDuLieu ?? [];
		for (const field of required.thuocTinhDuLieu ?? []) {
			if (!fields.some((item) => item.code === field.code)) fields.push({ ...field });
		}
		existing.thuocTinhDuLieu = fields;
	}
	return result;
};

export const readBriefTitle = (rows: CatalogRow[] = []) => {
	const titleRows = rows.filter((item) => item.tagCode === '245');
	const values = titleRows.flatMap((item) =>
		(item.thuocTinhAnPham ?? []).filter((field) => field.code === '$b').map((field) => String(field.value ?? '')),
	);
	return {
		nhanDeSongSong: values[0] ?? '',
		phuDe: values[1] ?? '',
		ambiguousSingleValue: values.length === 1,
		requiresDetailedCataloging: values.length > 2 || titleRows.length > 1,
		values,
	};
};

export const prepareBriefTitlePayload = <T extends { nhanDeSongSong?: string; phuDe?: string }>(
	values: T,
	omitTitlePair = false,
): T => {
	const payload = { ...values };
	if (omitTitlePair) {
		delete payload.nhanDeSongSong;
		delete payload.phuDe;
	} else {
		payload.nhanDeSongSong = values.nhanDeSongSong ?? '';
		payload.phuDe = values.phuDe ?? '';
	}
	return payload;
};

/** Keep the imported title snapshot consistent with edits made before the initial save. */
export const applyBriefTitleToRows = <T extends CatalogRow>(
	rows: T[] = [],
	values: { nhanDeSongSong?: string; phuDe?: string },
): T[] =>
	rows.map((row) => {
		if (row.tagCode !== '245') return row;
		const replacements = [values.nhanDeSongSong, values.phuDe]
			.filter((value): value is string => value !== undefined && value !== null && value !== '')
			.map((value) => ({ code: '$b', value }));
		let inserted = false;
		const fields: CatalogSubfield[] = [];
		for (const field of row.thuocTinhAnPham ?? []) {
			if (field.code !== '$b') fields.push({ ...field });
			else if (!inserted) {
				fields.push(...replacements);
				inserted = true;
			}
		}
		if (!inserted) fields.push(...replacements);
		return { ...row, thuocTinhAnPham: fields };
	});

/** Preserve imported repetitions absent from the brief record, with saved values taking precedence. */
export const mergeImportedCatalogRows = (saved: CatalogRow[] = [], imported: CatalogRow[] = []): CatalogRow[] => {
	const usedImportedRows = new Set<number>();
	const result = saved.map((row) => {
		const importedIndex = imported.findIndex(
			(item, index) => item.tagCode === row.tagCode && !usedImportedRows.has(index),
		);
		if (importedIndex < 0) return row;
		usedImportedRows.add(importedIndex);
		const source = imported[importedIndex];
		const savedFields = row.thuocTinhAnPham ?? [];
		const usedSavedFields = new Set<number>();
		const fields = (source.thuocTinhAnPham ?? []).map((field) => {
			const savedIndex = savedFields.findIndex(
				(item, index) => item.code === field.code && !usedSavedFields.has(index),
			);
			if (savedIndex < 0) return { ...field };
			usedSavedFields.add(savedIndex);
			return { ...field, ...savedFields[savedIndex] };
		});
		fields.push(...savedFields.filter((_, index) => !usedSavedFields.has(index)).map((item) => ({ ...item })));
		return { ...source, ...row, thuocTinhAnPham: fields };
	});
	result.push(...imported.filter((_, index) => !usedImportedRows.has(index)).map((item) => ({ ...item, _id: null })));
	return result;
};

/** Keep every saved subfield and occurrence, then append missing fields from the template. */
export const buildDetailedCatalogRows = (
	rows: CatalogRow[] = [],
	template: CatalogTemplateTag[] = [],
	tags: { ma: string; noiDung?: string; thuocTinh?: { code?: string; tieuDe?: string }[] }[] = [],
): CatalogRow[] => {
	const declarations = completeCatalogTemplate(template);
	const declarationsByTag = new Map(declarations.map((item) => [item.tag, item]));
	const tagNames = new Map(tags.map((item) => [item.ma, item]));
	const result = rows.map((row) => {
		const declaration = declarationsByTag.get(row.tagCode ?? '');
		const tag = row.tag ?? tagNames.get(row.tagCode ?? '');
		const declaredFields = declaration?.thuocTinhDuLieu ?? [];
		const fields: CatalogSubfield[] = (row.thuocTinhAnPham ?? []).map((field) => ({
			...field,
			value: field.value ?? null,
			ten:
				field.ten ||
				declaredFields.find((item) => item.code === field.code)?.ten ||
				tag?.thuocTinh?.find((item) => item.code === field.code)?.tieuDe,
		}));
		// A legacy scalar value belongs to the first declared field; never discard it when adding fields.
		if (!fields.length && row.value !== undefined && row.value !== null && declaredFields.length) {
			fields.push({ ...declaredFields[0], value: row.value });
		}
		const usedFields = new Set<number>();
		for (const declared of declaredFields) {
			const index = fields.findIndex((item, fieldIndex) => item.code === declared.code && !usedFields.has(fieldIndex));
			if (index >= 0) usedFields.add(index);
			else {
				fields.push({ ...declared, value: null });
				usedFields.add(fields.length - 1);
			}
		}
		return {
			...row,
			ten: declaration?.ten || row.ten || tag?.noiDung,
			thuocTinhAnPham: fields,
			value: fields.length ? undefined : row.value,
		};
	});
	const existingTags = new Set(rows.map((item) => item.tagCode));
	for (const declaration of declarations) {
		if (existingTags.has(declaration.tag)) continue;
		result.push({
			_id: null,
			tagCode: declaration.tag,
			ten: declaration.ten || tagNames.get(declaration.tag)?.noiDung,
			thuocTinhAnPham: (declaration.thuocTinhDuLieu ?? []).map((item) => ({ ...item, value: null })),
			value: undefined,
		});
	}
	return result.sort((left, right) => (left.tagCode ?? '').localeCompare(right.tagCode ?? ''));
};

export const sortSubfieldsForDisplay = (fields: CatalogSubfield[] = []) =>
	fields
		.map((field, originalIndex) => ({ ...field, originalIndex }))
		.sort(
			(left, right) => (left.code ?? '').localeCompare(right.code ?? '') || left.originalIndex - right.originalIndex,
		);

export const serializeDetailedCatalogRows = (rows: CatalogRow[] = []) =>
	rows.map((item) => ({
		_id: item._id,
		ind1: item.ind1,
		ind2: item.ind2,
		tagCode: item.tagCode,
		value: item.value,
		thuocTinhAnPham: (item.thuocTinhAnPham ?? []).map((field) => ({ code: field.code, value: field.value ?? '' })),
	}));
