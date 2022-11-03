import { Column, Entity, PrimaryColumn } from "typeorm";

export enum Element {
  H = "H",
  He = "He",
  Li = "Li",
  Be = "Be",
  B = "B",
  C = "C",
  N = "N",
  O = "O",
  F = "F",
  Ne = "Ne",
  Na = "Na",
  Mg = "Mg",
  Al = "Al",
  Si = "Si",
  P = "P",
  S = "S",
  Cl = "Cl",
  Ar = "Ar",
  K = "K",
  Ca = "Ca",
  Sc = "Sc",
  Ti = "Ti",
  V = "V",
  Cr = "Cr",
  Mn = "Mn",
  Fe = "Fe",
  Co = "Co",
  Ni = "Ni",
  Cu = "Cu",
  Zn = "Zn",
  Ga = "Ga",
  Ge = "Ge",
  As = "As",
  Se = "Se",
  Br = "Br",
  Kr = "Kr",
  Rb = "Rb",
  Sr = "Sr",
  Y = "Y",
  Zr = "Zr",
  Nb = "Nb",
  Mo = "Mo",
  Tc = "Tc",
  Ru = "Ru",
  Rh = "Rh",
  Pd = "Pd",
  Ag = "Ag",
  Cd = "Cd",
  In = "In",
  Sn = "Sn",
  Sb = "Sb",
  Te = "Te",
  I = "I",
  Xe = "Xe",
  Cs = "Cs",
  Ba = "Ba",
  La = "La",
  Ce = "Ce",
  Pr = "Pr",
  Nd = "Nd",
  Pm = "Pm",
  Sm = "Sm",
  Eu = "Eu",
  Gd = "Gd",
  Tb = "Tb",
  Dy = "Dy",
  Ho = "Ho",
  Er = "Er",
  Tm = "Tm",
  Yb = "Yb",
  Lu = "Lu",
  Hf = "Hf",
  Ta = "Ta",
  W = "W",
  Re = "Re",
  Os = "Os",
  Ir = "Ir",
  Pt = "Pt",
  Au = "Au",
  Hg = "Hg",
  Tl = "Tl",
  Pb = "Pb",
  Bi = "Bi",
  Po = "Po",
  At = "At",
  Rn = "Rn",
  Fr = "Fr",
  Ra = "Ra",
  Ac = "Ac",
  Th = "Th",
  Pa = "Pa",
  U = "U",
  Np = "Np",
  Pu = "Pu",
  Am = "Am",
  Cm = "Cm",
  Bk = "Bk",
  Cf = "Cf",
  Es = "Es",
  Fm = "Fm",
  Md = "Md",
  No = "No",
  Lr = "Lr",
  Rf = "Rf",
  Db = "Db",
  Sq = "Sg",
  Bh = "Bh",
  Hs = "Hs",
  Mt = "Mt",
  Ds = "Ds",
  Rq = "Rg",
  Cn = "Cn",
  Nh = "Nh",
  Fl = "Fl",
  Mc = "Mc",
  Lv = "Lv",
  Ts = "Ts",
  Og = "Og"
}

export class MolecularFormulaEntry {
  element: Element;
  count: number;

  constructor(element: Element, count: number) {
    this.element = element;
    this.count = count;
  }

  public static fromStr(str: string): MolecularFormulaEntry {
    const [atomStr, atomCountStr] = str.substring(1, str.length - 1).split(",");
    const element = atomStr as Element;
    const atomCount = +atomCountStr;

    if (isNaN(atomCount)) throw new TypeError(`invalid amount in record atomCount: [${atomStr}][${atomCountStr}]`);

    return new MolecularFormulaEntry(element, atomCount);
  }

  public static toStr(obj: MolecularFormulaEntry): string {
    return `(${obj.element},${obj.count})`;
  }
}

export class MolecularFormula {
  atoms: MolecularFormulaEntry[];
  charge: number;

  constructor(atoms: MolecularFormulaEntry[], charge: number) {
    this.atoms = atoms;
    this.charge = charge;
  }

  public static fromStr(str: string): MolecularFormula {
    const atoms: MolecularFormulaEntry[] = [];
    const regex = /\([a-zA-Z]+,\d+\)/g;

    if (!str) return new MolecularFormula(atoms, -1);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [...str.matchAll(regex)].forEach((match, i) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      match.forEach((value, j) => {
        atoms.push(MolecularFormulaEntry.fromStr(value));
      });
    });

    const charge = +(str.split(",").at(-1)?.replace(")", "") ?? "");

    if (isNaN(charge)) throw new TypeError(`invalid amount in record charge`);

    return new MolecularFormula(atoms, charge);
  }

  public static toStr(obj: MolecularFormula): string {
    const atomsStrArr: string[] = [];
    obj.atoms.forEach(function (atom) {
      atomsStrArr.push(`""${MolecularFormulaEntry.toStr(atom)}""`);
    });

    const atomsStr = atomsStrArr.join(",");

    return `("{${atomsStr}}",${obj.charge})`;
  }
}

export class LigandForm {
  protonation: number;
  charge: number;

  constructor(protonation: number, charge: number) {
    this.protonation = protonation;
    this.charge = charge;
  }

  public static fromStr(str: string): LigandForm {
    str = str.substring(1, str.length - 1);

    const [protonationStr, chargeStr] = str.split(",");
    const protonation = +protonationStr;
    const charge = +chargeStr;

    if (isNaN(protonation)) throw new TypeError(`invalid amount in record protonation: [${protonationStr}]`);
    if (isNaN(charge)) throw new TypeError(`invalid amount in record charge: [${chargeStr}]`);

    return new LigandForm(protonation, charge);
  }

  public static toStr(obj: LigandForm): string {
    return `("{${obj.protonation}}",${obj.charge})`;
  }
}

@Entity({ name: "ligands" })
export class Ligand {
  @PrimaryColumn()
  id!: number;

  @Column({ name: "legacy_nist46_id" })
  legacyId!: number;

  @Column()
  name!: string;

  @Column("text", {
    name: "molecular_formula",
    nullable: true,
    transformer: {
      from(value: string): MolecularFormula {
        return MolecularFormula.fromStr(value);
      },
      to(value: MolecularFormula): string {
        return MolecularFormula.toStr(value);
      }
    }
  })
  molecularFormula?: string;

  @Column({ nullable: true })
  charge?: number;

  @Column("text", {
    nullable: true,
    transformer: {
      from(value: string): LigandForm {
        return LigandForm.fromStr(value);
      },
      to(value: LigandForm): string {
        return LigandForm.toStr(value);
      }
    }
  })
  form?: LigandForm;

  @Column("text", {
    transformer: {
      from(value: string): string[] {
        return value.substring(1, value.length - 1).split(",");
      },
      to(value: string[]): string {
        const str = value.join(",");

        return `{${str}}`;
      }
    }
  })
  categories!: string[];
}
