n=11   # number of intervals
max=13 # max value
min=2  # min value
width=(max-min)/n #interval width
#function used to map a value to the intervals
hist(x,width)=width*(floor((x-min)/width))+min
set boxwidth width*0.9
set style fill solid 0.5 # fill style
set xrange [-10:12]
set ylabel "Percent chance of winning"
set xlabel "Advantage added to your 2d6 roll"
set yrange [0:100]
#count and plot
set term png font "arial,16"
plot "2d6-beating.data" using (hist($1,width)):(1.0/12.96) smooth freq with boxes linecolor rgb"green" notitle
