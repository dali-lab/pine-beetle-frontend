# Carissa's script to make predictions based on hard-coded coefficients,
# requiring these variables as input:
#	SPB: SPB per trap per two weeks during spring trapping (year t)
#	cleridst1: clerids per trap per two weeks during spring trapping last year (t-1)
#	spotst1: beetle spots in forest last year (t-1)
#	spotst2: beetle spots in forest two years ago (t-2)
#	endobrev: 0 or 1 for endobrevicomin absent or present in SPB traps
# originally the above were also hard-coded with SPB = 2635, cleridst1 = 582, spotst1 = 1056, spotst2 = 471, endobrev = 1

attach(input[[1]])  # take parameters (SPB, clerids, spots, endobrev) as input (instead of hard-coding) - see ./runRModel.js

# Coefficients below were estimated for a zero-inflated Poisson model fit to historical data using pscl package in R.
# These coefficients, and means and SDs that follow, remain the same for all predictions.
# ______ Later insert code here that will ... 
# ............ Refit the model with updated data. Assign new coefficient estimates to the variable names below.
# ............ Calculate means and SDs of the transformed input data. Assign these values to the variable names below.
# ______ End of subroutine for updating model

# coefficients for binomial model; predicts pi
b0_binom = 0.3021     # intercept
b1_binom = -1.2839    # SPB this year
b2_binom =	0.3914    # clerids last year
b3_binom = -1.1131    # spots last year
b4_binom =	-0.3992	  # spots two years ago

# coefficients for count model; predicts mu
b0_count = 0.9450     # intercept
b1_count = 0.2383     # SPB this year
b2_count =-0.0752     # clerids last year
b3_count = 0.2411     # spots last year

# means and SDs of the data used to fit the model. Used for centering and standardized the log transformed input data
SPB_mean = 2.71475
SPB_SD = 2.33682
cleridst1_mean = 4.23497
cleridst1_SD = 1.49437
spotst1_mean = 1.78163
spotst1_SD = 2.28771
spotst2_mean = 1.96596
spotst2_SD = 2.35512


# Prepare input data for model calculations
if (endobrev==1) SPB=SPB/10     # divide SPB trap captures by 10 if endobrevicomin was used

lnSPB=log(SPB+1)                # log transformations
lncleridst1=log(cleridst1+1)
lnspotst1=log(spotst1+1)
lnspotst2=log(spotst2+1)

SPB_adj=(lnSPB-SPB_mean)/SPB_SD                           # standardize and adjust log transformed values
cleridst1_adj=(lncleridst1-cleridst1_mean)/cleridst1_SD
spotst1_adj=(lnspotst1-spotst1_mean)/spotst1_SD
spotst2_adj=(lnspotst2-spotst2_mean)/spotst2_SD

# Calculate mu and pi
pi_pre = b0_binom+b1_binom*SPB_adj+b2_binom*cleridst1_adj+b3_binom*spotst1_adj+b4_binom*spotst2_adj
mu_pre = b0_count+b1_count*SPB_adj+b2_count*cleridst1_adj+b3_count*spotst1_adj
pi=exp(pi_pre)/(1+exp(pi_pre))
mu=exp(mu_pre)
expSpots_if_spots=exp(mu)-1

Z=dpois(0, mu)         # probability of 0 spots from count model, given mu
ProbSpots.GT.0    = 1-(pi+(1-pi)*Z)                             # probability of > 0 spots considering both binomial and count model
ProbSpots.GT.0    = 1-(pi+(1-pi)*ppois(0,mu,lower.tail=TRUE))    # probability of > 0 spots considering both binomial and count model
ProbSpots.GT.18   = 1-(pi+(1-pi)*ppois(2,mu,lower.tail=TRUE))    # probability of > 18 spots considering both binomial and count model
ProbSpots.GT.53   = 1-(pi+(1-pi)*ppois(3,mu,lower.tail=TRUE))    # probability of > 53 spots considering both binomial and count model
ProbSpots.GT.147  = 1-(pi+(1-pi)*ppois(4,mu,lower.tail=TRUE))    # probability of > 147 spots considering both binomial and count model
ProbSpots.GT.402 = 1-(pi+(1-pi)*ppois(5,mu,lower.tail=TRUE))    # probability of > 1095 spots considering both binomial and count model
ProbSpots.GT.1095 = 1-(pi+(1-pi)*ppois(6,mu,lower.tail=TRUE))    # probability of > 2979 spots considering both binomial and count model

# Put all the probabilities together in one data frame.
preds <- as.data.frame(c(pi,mu,expSpots_if_spots,ProbSpots.GT.0,ProbSpots.GT.18,ProbSpots.GT.53,ProbSpots.GT.147,ProbSpots.GT.402,ProbSpots.GT.1095))
rownames(preds) <- c("pi","mu","Exp spots if outbreak","prob.Spots>0","prob.Spots>19","prob.Spots>53","prob.Spots>147","prob.Spots>402","prob.Spots>1095")
colnames(preds) <- "Predictions"
preds # returned as JSON when this script is run through package r-script (see ./runRModel.js)
