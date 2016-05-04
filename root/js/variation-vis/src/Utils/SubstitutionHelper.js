/* substitution matrix is taken from R package:
#source("http://bioconductor.org/biocLite.R")
#biocLite("Biostrings")*/

const PAN250_STRING = "{\"AA\":2,\"AR\":-2,\"AN\":0,\"AD\":0,\"AC\":-2,\"AQ\":0,\"AE\":0,\"AG\":1,\"AH\":-1,\"AI\":-1,\"AL\":-2,\"AK\":-1,\"AM\":-1,\"AF\":-3,\"AP\":1,\"AS\":1,\"AT\":1,\"AW\":-6,\"AY\":-3,\"AV\":0,\"AB\":0,\"AZ\":0,\"AX\":0,\"A*\":-8,\"RA\":-2,\"RR\":6,\"RN\":0,\"RD\":-1,\"RC\":-4,\"RQ\":1,\"RE\":-1,\"RG\":-3,\"RH\":2,\"RI\":-2,\"RL\":-3,\"RK\":3,\"RM\":0,\"RF\":-4,\"RP\":0,\"RS\":0,\"RT\":-1,\"RW\":2,\"RY\":-4,\"RV\":-2,\"RB\":-1,\"RZ\":0,\"RX\":-1,\"R*\":-8,\"NA\":0,\"NR\":0,\"NN\":2,\"ND\":2,\"NC\":-4,\"NQ\":1,\"NE\":1,\"NG\":0,\"NH\":2,\"NI\":-2,\"NL\":-3,\"NK\":1,\"NM\":-2,\"NF\":-3,\"NP\":0,\"NS\":1,\"NT\":0,\"NW\":-4,\"NY\":-2,\"NV\":-2,\"NB\":2,\"NZ\":1,\"NX\":0,\"N*\":-8,\"DA\":0,\"DR\":-1,\"DN\":2,\"DD\":4,\"DC\":-5,\"DQ\":2,\"DE\":3,\"DG\":1,\"DH\":1,\"DI\":-2,\"DL\":-4,\"DK\":0,\"DM\":-3,\"DF\":-6,\"DP\":-1,\"DS\":0,\"DT\":0,\"DW\":-7,\"DY\":-4,\"DV\":-2,\"DB\":3,\"DZ\":3,\"DX\":-1,\"D*\":-8,\"CA\":-2,\"CR\":-4,\"CN\":-4,\"CD\":-5,\"CC\":12,\"CQ\":-5,\"CE\":-5,\"CG\":-3,\"CH\":-3,\"CI\":-2,\"CL\":-6,\"CK\":-5,\"CM\":-5,\"CF\":-4,\"CP\":-3,\"CS\":0,\"CT\":-2,\"CW\":-8,\"CY\":0,\"CV\":-2,\"CB\":-4,\"CZ\":-5,\"CX\":-3,\"C*\":-8,\"QA\":0,\"QR\":1,\"QN\":1,\"QD\":2,\"QC\":-5,\"QQ\":4,\"QE\":2,\"QG\":-1,\"QH\":3,\"QI\":-2,\"QL\":-2,\"QK\":1,\"QM\":-1,\"QF\":-5,\"QP\":0,\"QS\":-1,\"QT\":-1,\"QW\":-5,\"QY\":-4,\"QV\":-2,\"QB\":1,\"QZ\":3,\"QX\":-1,\"Q*\":-8,\"EA\":0,\"ER\":-1,\"EN\":1,\"ED\":3,\"EC\":-5,\"EQ\":2,\"EE\":4,\"EG\":0,\"EH\":1,\"EI\":-2,\"EL\":-3,\"EK\":0,\"EM\":-2,\"EF\":-5,\"EP\":-1,\"ES\":0,\"ET\":0,\"EW\":-7,\"EY\":-4,\"EV\":-2,\"EB\":3,\"EZ\":3,\"EX\":-1,\"E*\":-8,\"GA\":1,\"GR\":-3,\"GN\":0,\"GD\":1,\"GC\":-3,\"GQ\":-1,\"GE\":0,\"GG\":5,\"GH\":-2,\"GI\":-3,\"GL\":-4,\"GK\":-2,\"GM\":-3,\"GF\":-5,\"GP\":0,\"GS\":1,\"GT\":0,\"GW\":-7,\"GY\":-5,\"GV\":-1,\"GB\":0,\"GZ\":0,\"GX\":-1,\"G*\":-8,\"HA\":-1,\"HR\":2,\"HN\":2,\"HD\":1,\"HC\":-3,\"HQ\":3,\"HE\":1,\"HG\":-2,\"HH\":6,\"HI\":-2,\"HL\":-2,\"HK\":0,\"HM\":-2,\"HF\":-2,\"HP\":0,\"HS\":-1,\"HT\":-1,\"HW\":-3,\"HY\":0,\"HV\":-2,\"HB\":1,\"HZ\":2,\"HX\":-1,\"H*\":-8,\"IA\":-1,\"IR\":-2,\"IN\":-2,\"ID\":-2,\"IC\":-2,\"IQ\":-2,\"IE\":-2,\"IG\":-3,\"IH\":-2,\"II\":5,\"IL\":2,\"IK\":-2,\"IM\":2,\"IF\":1,\"IP\":-2,\"IS\":-1,\"IT\":0,\"IW\":-5,\"IY\":-1,\"IV\":4,\"IB\":-2,\"IZ\":-2,\"IX\":-1,\"I*\":-8,\"LA\":-2,\"LR\":-3,\"LN\":-3,\"LD\":-4,\"LC\":-6,\"LQ\":-2,\"LE\":-3,\"LG\":-4,\"LH\":-2,\"LI\":2,\"LL\":6,\"LK\":-3,\"LM\":4,\"LF\":2,\"LP\":-3,\"LS\":-3,\"LT\":-2,\"LW\":-2,\"LY\":-1,\"LV\":2,\"LB\":-3,\"LZ\":-3,\"LX\":-1,\"L*\":-8,\"KA\":-1,\"KR\":3,\"KN\":1,\"KD\":0,\"KC\":-5,\"KQ\":1,\"KE\":0,\"KG\":-2,\"KH\":0,\"KI\":-2,\"KL\":-3,\"KK\":5,\"KM\":0,\"KF\":-5,\"KP\":-1,\"KS\":0,\"KT\":0,\"KW\":-3,\"KY\":-4,\"KV\":-2,\"KB\":1,\"KZ\":0,\"KX\":-1,\"K*\":-8,\"MA\":-1,\"MR\":0,\"MN\":-2,\"MD\":-3,\"MC\":-5,\"MQ\":-1,\"ME\":-2,\"MG\":-3,\"MH\":-2,\"MI\":2,\"ML\":4,\"MK\":0,\"MM\":6,\"MF\":0,\"MP\":-2,\"MS\":-2,\"MT\":-1,\"MW\":-4,\"MY\":-2,\"MV\":2,\"MB\":-2,\"MZ\":-2,\"MX\":-1,\"M*\":-8,\"FA\":-3,\"FR\":-4,\"FN\":-3,\"FD\":-6,\"FC\":-4,\"FQ\":-5,\"FE\":-5,\"FG\":-5,\"FH\":-2,\"FI\":1,\"FL\":2,\"FK\":-5,\"FM\":0,\"FF\":9,\"FP\":-5,\"FS\":-3,\"FT\":-3,\"FW\":0,\"FY\":7,\"FV\":-1,\"FB\":-4,\"FZ\":-5,\"FX\":-2,\"F*\":-8,\"PA\":1,\"PR\":0,\"PN\":0,\"PD\":-1,\"PC\":-3,\"PQ\":0,\"PE\":-1,\"PG\":0,\"PH\":0,\"PI\":-2,\"PL\":-3,\"PK\":-1,\"PM\":-2,\"PF\":-5,\"PP\":6,\"PS\":1,\"PT\":0,\"PW\":-6,\"PY\":-5,\"PV\":-1,\"PB\":-1,\"PZ\":0,\"PX\":-1,\"P*\":-8,\"SA\":1,\"SR\":0,\"SN\":1,\"SD\":0,\"SC\":0,\"SQ\":-1,\"SE\":0,\"SG\":1,\"SH\":-1,\"SI\":-1,\"SL\":-3,\"SK\":0,\"SM\":-2,\"SF\":-3,\"SP\":1,\"SS\":2,\"ST\":1,\"SW\":-2,\"SY\":-3,\"SV\":-1,\"SB\":0,\"SZ\":0,\"SX\":0,\"S*\":-8,\"TA\":1,\"TR\":-1,\"TN\":0,\"TD\":0,\"TC\":-2,\"TQ\":-1,\"TE\":0,\"TG\":0,\"TH\":-1,\"TI\":0,\"TL\":-2,\"TK\":0,\"TM\":-1,\"TF\":-3,\"TP\":0,\"TS\":1,\"TT\":3,\"TW\":-5,\"TY\":-3,\"TV\":0,\"TB\":0,\"TZ\":-1,\"TX\":0,\"T*\":-8,\"WA\":-6,\"WR\":2,\"WN\":-4,\"WD\":-7,\"WC\":-8,\"WQ\":-5,\"WE\":-7,\"WG\":-7,\"WH\":-3,\"WI\":-5,\"WL\":-2,\"WK\":-3,\"WM\":-4,\"WF\":0,\"WP\":-6,\"WS\":-2,\"WT\":-5,\"WW\":17,\"WY\":0,\"WV\":-6,\"WB\":-5,\"WZ\":-6,\"WX\":-4,\"W*\":-8,\"YA\":-3,\"YR\":-4,\"YN\":-2,\"YD\":-4,\"YC\":0,\"YQ\":-4,\"YE\":-4,\"YG\":-5,\"YH\":0,\"YI\":-1,\"YL\":-1,\"YK\":-4,\"YM\":-2,\"YF\":7,\"YP\":-5,\"YS\":-3,\"YT\":-3,\"YW\":0,\"YY\":10,\"YV\":-2,\"YB\":-3,\"YZ\":-4,\"YX\":-2,\"Y*\":-8,\"VA\":0,\"VR\":-2,\"VN\":-2,\"VD\":-2,\"VC\":-2,\"VQ\":-2,\"VE\":-2,\"VG\":-1,\"VH\":-2,\"VI\":4,\"VL\":2,\"VK\":-2,\"VM\":2,\"VF\":-1,\"VP\":-1,\"VS\":-1,\"VT\":0,\"VW\":-6,\"VY\":-2,\"VV\":4,\"VB\":-2,\"VZ\":-2,\"VX\":-1,\"V*\":-8,\"BA\":0,\"BR\":-1,\"BN\":2,\"BD\":3,\"BC\":-4,\"BQ\":1,\"BE\":3,\"BG\":0,\"BH\":1,\"BI\":-2,\"BL\":-3,\"BK\":1,\"BM\":-2,\"BF\":-4,\"BP\":-1,\"BS\":0,\"BT\":0,\"BW\":-5,\"BY\":-3,\"BV\":-2,\"BB\":3,\"BZ\":2,\"BX\":-1,\"B*\":-8,\"ZA\":0,\"ZR\":0,\"ZN\":1,\"ZD\":3,\"ZC\":-5,\"ZQ\":3,\"ZE\":3,\"ZG\":0,\"ZH\":2,\"ZI\":-2,\"ZL\":-3,\"ZK\":0,\"ZM\":-2,\"ZF\":-5,\"ZP\":0,\"ZS\":0,\"ZT\":-1,\"ZW\":-6,\"ZY\":-4,\"ZV\":-2,\"ZB\":2,\"ZZ\":3,\"ZX\":-1,\"Z*\":-8,\"XA\":0,\"XR\":-1,\"XN\":0,\"XD\":-1,\"XC\":-3,\"XQ\":-1,\"XE\":-1,\"XG\":-1,\"XH\":-1,\"XI\":-1,\"XL\":-1,\"XK\":-1,\"XM\":-1,\"XF\":-2,\"XP\":-1,\"XS\":0,\"XT\":0,\"XW\":-4,\"XY\":-2,\"XV\":-1,\"XB\":-1,\"XZ\":-1,\"XX\":-1,\"X*\":-8}"

const substitutionMatrices = {
  PAN250: JSON.parse(PAN250_STRING),
};

function getSubstitutionScore(aminoAcid1, aminoAcid2, matrixName='PAN250') {
  const matrix = substitutionMatrices[matrixName];
  const substitutionString = `${aminoAcid1}${aminoAcid2}`;
  return matrix[substitutionString];
}

export default {
  getSubstitutionScore
}