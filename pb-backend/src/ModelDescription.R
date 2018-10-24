# October 9, 2018

# Zero-Inflated Poisson Model of Southern Pine Beetle Infestation

# The most important thing to know about this model is that it is a two part regression.
# One part is governed by a binomial distribution, and the other part is governed by a 
# Poisson distribution. Zeros are possible in both parts, so the final equation is a little
# more complicated than just adding two regressions together. The pscl package does a lot of
# the two-part model computation for you. 

## Input Data

# Input data required to run the model are: 
  # of SPB
  # of clerids last year
  # of spots last year
  # of spots two years ago
  
# Before running the model, these numbers should be natural log +1-transformed, 
# then scaled and centered. Log-transform code not shown. Scaling and centering code shown below. 

# Required package
needs(pscl)
library(pscl)

# Read in the log+1-transformed data, make sure spots are in integers
# logDt <- read.csv("C:\\Users\\Carissa\\Dropbox\\SPB\\AA.PREDICTION_SYSTEM\ModelForDALI\logDt.csv")
logDt <- read.csv('/Users/isabelhurley/DALI/pine-beetle/project-pine-beetle/pb-backend/src/data/SPB2016_toDALI.csv') #TODO this is NOT log+1-transformed data
logDt$spots <- round(logDt$spots, digits=0) # TODO error: non-numeric argument to mathematical function


# # Scale and center covariates; note that this code standardizes all the possible predictors,
# # not just the ones needed for the model. This way if the model changes in the future to 
# # use different predictors, I don't need to re-write this part. dplyr is needed for the 
# # # mutate function.
# needs(dplyr)
# library(dplyr)
# finalDt <- logDt %>% mutate_at(vars("host_1000ha","spb","spb.t1","clerids","clerids.t1","pctSPB",
#                                     "pctSPB.t1","spots.t1","spots.t2"),funs(scale(.) %>% as.vector))

# # If needed, save transformed, standardized file
# save(finalDt,file="finalDt.RData")

# ## ------------------------------------------------------------------------

# ## Code for best fitting model; the zeroinfl function is contained in the pscl package.
# bestFit <- zeroinfl(spots ~ 1 + spb + clerids.t1 + spots.t1 
#                          | 1 + spb + clerids.t1 + spots.t1 + spots.t2,
#                          data = finalDt, dist = "poisson")
# # If you need to extract the coefficients from the model you can use:
# coef(bestFit) 
# # In the output from coef, The binomial half of the model's coefs are listed as "zero_x"
# # and the count half of the model's coefs are listed as "count_x"

# ## ------------------------------------------------------------------------

# # Read in full data used in model, coerce spots to integers
# # logDt <- read.csv("C:\\Users\\Carissa\\Dropbox\\SPB\\SOUTHWIDE\\Modeling\\MattModeling\\MattDt.csv")
# logDt <- read.csv('./data/SPB2016_toDALI.csv') #TODO this is same data as above
# logDt$spots <- round(logDt$spots, digits=0)

# # Read in new data (single row), already log+1-transformed
# # homNewRow <- read.csv("C:\\Users\\Carissa\\Dropbox\\SPB\\AA.PREDICTION_SYSTEM\\ModelForDALI\\HomNewDt.csv")
# homNewRow <- read.csv('./data/SPB2016_toDALI.csv') #TODO this is NOT log+1-transformed data

# # Center and scale new data. There is a less clunky way to do this (2 lines of code instead of 12),
# # but I just spent several hours trying to get it to work and kept hitting a wall. So here's 
# # the clunky version for now. Centering is subtracting the mean, and scaling is dividing by 
# # the standard deviation.
# meanSPB <- mean(logDt$spb) 
# meanClerids.t1 <- mean(logDt$clerids.t1)
# meanSpots.t1 <- mean(logDt$spots.t1)
# meanSpots.t2 <- mean(logDt$spots.t2)

# sdSPB <- sd(logDt$spb) 
# sdClerids.t1 <- sd(logDt$clerids.t1)
# sdSpots.t1 <- sd(logDt$spots.t1)
# sdSpots.t2 <- sd(logDt$spots.t2)

# homNewRow$spb <- (homNewRow$spb - meanSPB)/sdSPB
# homNewRow$clerids.t1 <- (homNewRow$clerids.t1 - meanClerids.t1)/sdClerids.t1
# homNewRow$spots.t1 <- (homNewRow$spots.t1 - meanSpots.t1)/sdSpots.t1
# homNewRow$spots.t2 <- (homNewRow$spots.t1 - meanSpots.t1)/sdSpots.t1

# # So at this point, homNewRow contains the log+1-transformed, centered, and scaled new data,
# # in a single row. I'm pretty sure this should work for multiple rows (i.e., predictions for
# # multiple sites at one time) as well as for one row at a time, but this code is so you can
# # see how it works for a single site. 

# # extract probability density for new data
# probHomNew <- predict(bestFit, newdata=homNewRow, type="prob") 
# probHomNew <- as.data.frame(probHomNew)

# # Probability of >0 Spots
# probSpots <- (1 - round(probHomNew[,1],2))*100
# # Because we're using logged data, the bins here are for somewhat strange values.

# # Probability of >19 spots
# probG19 <- round(rowSums(probHomNew[,4:9])*100,2)
# probG19

# # Probability of >53 spots
# probG53 <- round(rowSums(probHomNew[,5:9])*100,2)
# probG53

# # Probability of >147 spots
# probG147 <- round(rowSums(probHomNew[,6:9])*100,2)
# probG147

# # Probability of >402 spots
# probG402 <- round(rowSums(probHomNew[,7:9])*100,2)
# probG402

# # Probability of >1095 spots
# probG1095 <- round(rowSums(probHomNew[,8:9])*100,2)
# probG1095

# # Put all the probabilities together in one data frame.
# preds <- as.data.frame(c(probSpots,probG19,probG53,probG147,probG402,probG1095))
# rownames(preds) <- c("pSpots","pG19","pG53","pG147","pG402","pG1095")
# colnames(preds) <- "Percent"
# preds
